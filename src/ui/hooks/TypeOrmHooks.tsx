import { EntityTarget, ObjectLiteral, DataSource, DeepPartial } from "typeorm";
import { useState, useEffect, useMemo } from "react";
import { RelationMetadata } from "typeorm/metadata/RelationMetadata";

function compareIds(o1 : ObjectLiteral | undefined, o2 : ObjectLiteral | undefined) {
  if(o1 === undefined || o2 == undefined) {
    return true
  }

  for(let [key, value] of Object.entries(o1)) {
    if (o2[key] == undefined || o2[key] !== value) {
      return false
    }
  }

  for(let [key, value] of Object.entries(o2)) {
    if (o1[key] == undefined || o1[key] !== value) {
      return false
    }
  }

  return true
}

// TODO add querys to the hooks so that we can react to entities base on criteria

// Provides a react hook where any new entities of a type is added or removed
export function useEntitiesState<Entity extends ObjectLiteral>(
  dataSource : DataSource,
  entityTarget : EntityTarget<Entity>
) : [entities : Entity[], createAndInsertEntity : (entity : DeepPartial<Entity>)=>void, removeEntity : (entity : Entity)=>void]
{
    const entityMetadata = dataSource.getMetadata(entityTarget)
    const [entities, setEntities] = useState<Entity[]>([]);
    
    const addEntityToList = async (entity : Entity) => {
      setEntities((oldEntities) => [...oldEntities, entity])
    }

    const createAndInsertEntity = async (entity : DeepPartial<Entity>) => {
      const entityRepository = dataSource.getRepository(entityTarget);
      const newEntity = entityRepository.create(entity);
      const newInsertedEntity = await entityRepository.save(newEntity);
      addEntityToList(newInsertedEntity);
    }

    const removeEntity = async (removingEntity : Entity) => {
        const entityRepository = dataSource.getRepository(entityTarget);
        await entityRepository.remove(removingEntity);
        setEntities(entities.filter(filterEntity => {
          const id1 = entityMetadata.getEntityIdMap(filterEntity)
          const id2 = entityMetadata.getEntityIdMap(removingEntity)
          return !compareIds(id1, id2)
        }))
    }

    useEffect(() => {
      async function fetchEntities() {
        const entityRepository = dataSource.getRepository(entityTarget);
        const fetchedEntities = await entityRepository.find();
        setEntities(fetchedEntities);
      }
  
      fetchEntities();

      // let removeSubscriber = EntityNotifier.subscribe(entityTarget, onRemove=>{
      //   if(onRemove.entity !== undefined) {
      //     removeEntity(onRemove.entity)
      //   }
      // }, "afterRemove")

      // let softRemoveSubscriber = EntityNotifier.subscribe(entityTarget, onSoftRemove=>{
      //   if(onSoftRemove.entity !== undefined) {
      //     removeEntity(onSoftRemove.entity)
      //   }
      // }, "afterSoftRemove")

      // let recoverSubscriber = EntityNotifier.subscribe(entityTarget, onRecover=>{
      //   if(onRecover.entity !== undefined) {
      //     addEntityToList(onRecover.entity as Entity)
      //   }
      // }, "afterRecover")

      // let insertSubscriber = EntityNotifier.subscribe(entityTarget, onRecover=>{
      //   if(onRecover.entity !== undefined) {
      //     addEntityToList(onRecover.entity as Entity)
      //   }
      // }, "afterInsert")

      // return () => {
      //   EntityNotifier.unsubscribe(removeSubscriber);
      //   EntityNotifier.unsubscribe(softRemoveSubscriber);
      //   EntityNotifier.unsubscribe(recoverSubscriber);
      //   EntityNotifier.unsubscribe(insertSubscriber);
      // }
    }, [dataSource, entityTarget]);
  return [entities, createAndInsertEntity, removeEntity];
}

// Provides a react hook for one-to-many or many-to-many relationships for a specific entity
// Returns a list of entities based on that relationship
// This allows you to detect when a new entity adds a relationship to a specific entity
// If you want to be able to use disconnect entity you will need the inverse of the relationship
// or the propertyEntity to be nullable
export function useEntityManyRelationshipState<OwnerEntity extends ObjectLiteral, NonOwnerEntity extends ObjectLiteral>(
  dataSource : DataSource,
  ownerEntity : EntityTarget<OwnerEntity>,
  nonOwnerEntity : EntityTarget<NonOwnerEntity>,
  propertyName : string,
  ownerEntityObject : OwnerEntity,
) : [entities : NonOwnerEntity[] | null,
     insertEntity: (entity : DeepPartial<NonOwnerEntity>)=>void,
     removeEntity: (entity : NonOwnerEntity)=>void,
     disconnectEntity: (entity : NonOwnerEntity)=>void]
{
  let relationship = useMemo(()=> {
    const ownerEntityMetadata = dataSource.getMetadata(ownerEntity);
    const nonOwnerEntityMetadata = dataSource.getMetadata(nonOwnerEntity);

    return ownerEntityMetadata.relations.find(relation =>
      (relation.relationType == "one-to-many" ||
      relation.relationType == "many-to-many" && relation.isManyToManyOwner) &&
      relation.inverseEntityMetadata.name == nonOwnerEntityMetadata.name &&
      relation.propertyName == propertyName)
  }, [dataSource, ownerEntity, nonOwnerEntity, propertyName])

  if(relationship == null || relationship == undefined) {
    console.error("Unable to find relationship")
    return;
  }

  const preloadedEntities = ownerEntityObject[relationship.propertyName]
  const [entities, setEntities] = useState<NonOwnerEntity[] | null>(preloadedEntities == undefined ? null : preloadedEntities);

  useEffect(() => {
    const ownerEntityMetadata = dataSource.getMetadata(ownerEntity);

    if(ownerEntityObject === null || ownerEntityObject === undefined) {
      return;
    }

    async function fetchEntities(relation : RelationMetadata) : Promise<NonOwnerEntity[] | null | undefined> {
      const ownerEntityRepository = dataSource.getRepository(ownerEntity);
      const entityId = ownerEntityMetadata.getEntityIdMap(ownerEntityObject);

      if (entityId === undefined) {
        console.error("No id found for parent")
        return 
      }

      let relations : ObjectLiteral = {};
      relations[relation.propertyName] = true;

      // Does this work in all cases? Should I do this?
      // Extract relation list from parent entity
      let foundParentEntity = await ownerEntityRepository.findOne({
        where: entityId as any,
        relations : relations as any,
      }) as any;
      
      return foundParentEntity[relation.propertyName];
    }

    async function load() {
      if (relationship !== undefined) {
        let entities = await fetchEntities(relationship)
        if(entities !== undefined) {
          setEntities(entities);
        }
      }
    }

    load();
  }, [dataSource, ownerEntityObject, relationship, ownerEntity]);

  const insertEntity = async (entity : DeepPartial<NonOwnerEntity>) => {
    const ownerEntityMetadata = dataSource.getMetadata(ownerEntity);

    if(ownerEntityObject === null || ownerEntityObject === undefined ||
      relationship === null || relationship === undefined) {
      return;
    }

    const ownerEntityRepository = dataSource.getRepository(ownerEntity);
    const nonOwnerEntityRepository = dataSource.getRepository(nonOwnerEntity);
    const entityId = ownerEntityMetadata.getEntityIdMap(ownerEntityObject);

    if (entityId == undefined || entityId == null) {
      console.error("No id found for parent")
      return 
    }

    let relations : ObjectLiteral = {};
    relations[relationship.propertyName] = true;

    // Does this work in all cases? Should I do this?
    // Extract relation list from parent entity
    let foundParentEntity = await ownerEntityRepository.findOne({
      where: entityId as any,
      relations : relations as any,
    }) as any;

    if(foundParentEntity === null) {
      console.error("Could not insert new entity could not find parent entity!")
      return;
    }

    // create a new entity
    let newEntity = nonOwnerEntityRepository.create(entity);
    newEntity = await nonOwnerEntityRepository.save(newEntity);

    // Add to parent list
    (foundParentEntity[relationship.propertyName] as NonOwnerEntity[]).push(newEntity)

    // Save new list
    await ownerEntityRepository.save(foundParentEntity)

    // Add to state
    setEntities((oldEntities) => {
      if(oldEntities == null) {
        return [newEntity]
      } else {
        return [...oldEntities, newEntity]
      }
    });
  }

  // Dones't check if the removingEntity is related to the parent entity
  const disconnectEntity = async (removingEntity : NonOwnerEntity) => {
    const nonOwnerEntityMetadata = dataSource.getMetadata(nonOwnerEntity);

    if(relationship === undefined) {
      console.warn("Relations not loaded")
      return
    }

    if(relationship.inverseRelation === undefined) {
      console.error("Inverse relationship not avaliable")
      return
    }

    if(relationship.inverseRelation.isNullable) {
      console.error("Inverse relationship needs to be nullable to disconnect entity from a relationship")
      return
    }

    const nonOwnerEntityRepository = dataSource.getRepository(nonOwnerEntity);

    // Remove a inverse relationship via property
    // so typeorm can handle updating the relation for us
    // Not the most efficent way of doing this but my knowledge is limited and this works.
    (removingEntity as any)[relationship.inverseRelation.propertyName] = null;
    await nonOwnerEntityRepository.save(removingEntity);

    if(entities != null) {
      const id2 = nonOwnerEntityMetadata.getEntityIdMap(removingEntity);
      setEntities(oldEntites => oldEntites && oldEntites.filter(filterEntity => {
        const id1 = nonOwnerEntityMetadata.getEntityIdMap(filterEntity);
        return !compareIds(id1, id2);
      }))
    }
  }

  // Dones't check if the removingEntity is related to the parent entity
  const removeEntity = async (removingEntity : NonOwnerEntity) => {
    try {
      const nonOwnerEntityRepository = dataSource.getRepository(nonOwnerEntity);

      const nonOwnerEntityMetadata = dataSource.getMetadata(nonOwnerEntity);
      const id2 = nonOwnerEntityMetadata.getEntityIdMap(removingEntity);
      if(id2 == undefined) {
        console.error("Unable to find id for entity")
        return;
      }

      // console.log("Fetching")
      // let foundEntity = await entityRepository.findOne({
      //   where: id2 as any, // Passing in the id map
      // })

      await nonOwnerEntityRepository.remove(removingEntity);
  
      if(entities != null) {
        setEntities(oldEntites => oldEntites && oldEntites.filter(filterEntity => {
          const id1 = nonOwnerEntityMetadata.getEntityIdMap(filterEntity);
          return !compareIds(id1, id2);
        }))
      }
    } catch (ex) {
      console.warn(ex)
    }
  }

  return [entities, insertEntity, removeEntity, disconnectEntity];
}

// Provides a react hook for many-to-one or one-to-one relationships for a specific entity
// Returns a entity based on that relationship
// This allows you to detect when a new entity has a relationship to an entity
export function useEntityOneRelationshipState<ParentEntity extends ObjectLiteral, PropertyEntity extends ObjectLiteral>(
  dataSource : DataSource,
  entityTarget : EntityTarget<ParentEntity>,
  propertyEntity : EntityTarget<PropertyEntity>,
  propertyName : string,
  parentEntity : ParentEntity,
) : [entity : PropertyEntity | null, (setEntity : PropertyEntity)=>void]
{
    const [entityState, setEntityState] = useState<PropertyEntity | null>(null);

    let relationship = useMemo(()=> {
      const parentEntityMetadata = dataSource.getMetadata(entityTarget);
      const propertyEntityMetadata = dataSource.getMetadata(propertyEntity);

      return parentEntityMetadata.relations.find(relation =>
        (relation.relationType == "many-to-many" || relation.relationType == "one-to-many") &&
        relation.inverseEntityMetadata.name == propertyEntityMetadata.name &&
        relation.propertyName == propertyName &&
        !relation.isNullable)
    }, [dataSource, entityTarget, propertyEntity, propertyName])

    useEffect(() => {
      const parentEntityMetadata = dataSource.getMetadata(entityTarget);

      async function fetchEntity(relation : RelationMetadata) : Promise<PropertyEntity | undefined> {
        const entityRepository = dataSource.getRepository(entityTarget);
        const entityId = parentEntityMetadata.getEntityIdMap(parentEntity);

        if (entityId === undefined) {
          console.error("No id found for parent")
          return 
        }

        let relations : ObjectLiteral = {};
        relations[relation.propertyName] = true;

        // Does this work in all cases? Should I do this?
        // Extract relation from parent entity
        let foundParentEntity = await entityRepository.findOne({
          where: entityId as any,
          relations : relations as any,
        }) as any;
        
        return foundParentEntity[relation.propertyName];
      }
  
      async function load() {
        if (relationship !== undefined) {
          let entity = await fetchEntity(relationship)
          if(entity !== undefined) {
            setEntityState(entity);
          }
        }
      }

      load();
    }, [dataSource, relationship, entityTarget, parentEntity]);

    const setNewEntity = async (newEntity : PropertyEntity) => {
      if(relationship === undefined) {
        console.warn("Relation not loaded")
        return
      }

      if(relationship.inverseRelation === undefined) {
        console.error("Inverse relationship not avaliable")
        return
      }

      const entityRepository = dataSource.getRepository(propertyEntity);
      if(entityState != null) {
        (entityState as any)[relationship.inverseRelation.propertyName] = null;
        await entityRepository.save(entityState);
      }

      (newEntity as any)[relationship.inverseRelation.propertyName] = parentEntity;
      await entityRepository.save(newEntity);
      setEntityState(newEntity);
    }

    return [entityState, setNewEntity];
}
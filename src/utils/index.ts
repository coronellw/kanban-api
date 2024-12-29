import { Document } from "mongoose"

export const isSubsetOf = <T>(list: Array<T>, target: Array<T>): boolean => list.every(item => target.includes(item))

export const getAllowedUpdates = <T extends Document>(item: T) => Object.keys(item.schema.paths).filter(k => !['_id', '__v'].includes(k)).map(k => k as keyof T)

/**
 * Applies the specified updates to the given model.
 * 
 * @param document - The Mongoose document to be updated.
 * @param updates - An object containing the updates to be applied.
 * @param allowedUpdates - An optional array of keys that are allowed to be updated. If not provided, it will be derived from the model schema.
 * @returns The updated model.
 * @throws Will throw an error if any of the update keys are not allowed.
 */
export const applyUpdates = <T extends Document>(document: T, updates: Record<string, any>, allowedUpdates: Array<keyof T> = []): T => {
  if (!allowedUpdates.length) {
    allowedUpdates = getAllowedUpdates(document)
  }
  
  const updateKeys = Object.keys(updates) as Array<keyof T>
  
  if (!isSubsetOf(updateKeys, allowedUpdates)) {
    throw new Error("Invalid update")
  }

  updateKeys.forEach(key => {
    document[key] = updates[key as string]
  })

  return document
}
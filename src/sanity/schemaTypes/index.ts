import { type SchemaTypeDefinition } from 'sanity'
import product from './food'
import chef from './chefs'
import order from './order'
import user from './user'
import reservation from './reservation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, chef, order, user, reservation],
}

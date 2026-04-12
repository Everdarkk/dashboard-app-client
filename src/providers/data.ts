import { BACKEND_BASE_URL } from '@/constants'
import { ListResponse } from '@/types'
import { CrudFilter, LogicalFilter } from '@refinedev/core'
import { CreateResponse } from '@refinedev/core'
import {createDataProvider, CreateDataProviderOptions} from '@refinedev/rest'

const normalizeResourcePath = (resource: string): string => resource.replace(/^\/+/, '')

const parseJsonOrThrow = async (response: Response) => {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(
      `Expected JSON from ${response.url}, got: ${text.slice(0, 120)}`
    )
  }
}

const API_BASE_URL = `${BACKEND_BASE_URL}/api`

const flattenLogicalFilters = (filters?: CrudFilter[]): LogicalFilter[] => {
  if (!filters?.length) return []

  return filters.flatMap((filter) => {
    if ('field' in filter) {
      return [filter]
    }

    return flattenLogicalFilters(filter.value)
  })
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => normalizeResourcePath(resource),

    buildQueryParams: async ({ resource, pagination, filters}) => {
      const page = pagination?.currentPage ?? 1
      const pageSize = pagination?.pageSize ?? 10

      const params: Record<string, string|number> = {page, limit: pageSize}
      const logicalFilters = flattenLogicalFilters(filters)

      logicalFilters.forEach((filter) => {
        const field = filter.field
        const operator = filter.operator

        const value = String(filter.value)

        if (resource === 'subjects') {
          if (field === 'department') params.department = value
          if ((field === 'name' || field === 'code') && !params.search) {
            params.search = value
          }
        }

        if (resource === 'classes') {
          if (field === 'name') params.search = value
          if (field === 'status') params.status = value
          if (field === 'subject' || field === 'subject.name') params.subject = value
          if (field === 'subjectId') params.subjectId = value
          if (field === 'teacherId') params.teacherId = value
          if (field === 'capacity' && operator === 'gte') params.capacityMin = value
          if (field === 'capacity' && operator === 'lte') params.capacityMax = value
        }

        if (resource === 'users') {
          if (field === 'role') params.role = value
          if (field === 'name' || field === 'email') params.search = value
        }
      })

      return params
    },

    mapResponse: async (response) => {
      const payload: ListResponse = await parseJsonOrThrow(response.clone())

      return payload.data ?? []
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await parseJsonOrThrow(response.clone())

      return payload.pagination?.total ?? payload.data?.length ?? 0
    }
  },
  create: {
    getEndpoint: ({ resource }) => normalizeResourcePath(resource),

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await parseJsonOrThrow(response)

      return json.data
    }
  }
}

const {dataProvider} = createDataProvider(API_BASE_URL, options, {
  credentials: 'include',
})

export { dataProvider }
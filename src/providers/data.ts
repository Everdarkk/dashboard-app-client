import { BACKEND_BASE_URL } from '@/constants'
import { ListResponse } from '@/types'
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

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => normalizeResourcePath(resource),

    buildQueryParams: async ({ resource, pagination, filters}) => {
      const page = pagination?.currentPage ?? 1
      const pageSize = pagination?.pageSize ?? 10

      const params: Record<string, string|number> = {page, limit: pageSize}

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : ''

        const value = String(filter.value)

        if (resource === 'subjects') {
          if (field === 'department') params.department = value
          if (field === 'name' || field === 'code') params.search = value
        }

        if (resource === 'classes') {
          if (field === 'name') params.search = value
          if (field === 'status') params.status = value
          if (field === 'subject') params.subject = value
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
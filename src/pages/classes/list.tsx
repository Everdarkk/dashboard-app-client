import { useMemo, useState } from "react"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CLASS_STATUS_OPTIONS } from "@/constants"
import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { useTable } from "@refinedev/react-table"
import { Class } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

const STATUS_VARIANT: Record<Class['status'], 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  archived: 'outline',
}

function ClassesList() {
  // STATES
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // FILTERS
  const statusFilters = selectedStatus === 'all' ? [] : [
    { field: 'status', operator: 'eq' as const, value: selectedStatus }
  ]
  const searchFilters = searchQuery ? [
    { field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : []

  // TABLE
  const classTable = useTable<Class>({
    columns: useMemo<ColumnDef<Class>[]>(() => [
      {
        id: 'name',
        accessorKey: 'name',
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">{getValue<string>()}</span>
        ),
        filterFn: 'includesString',
      },
      {
        id: 'subject',
        accessorKey: 'subject.name',
        size: 180,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ row }) => {
          const subject = row.original.subject
          return subject ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground text-sm">{subject.name}</span>
              <Badge variant="secondary" className="w-fit text-xs">{subject.code}</Badge>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )
        },
      },
      {
        id: 'teacher',
        accessorKey: 'teacher.name',
        size: 160,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ row }) => {
          const teacher = row.original.teacher
          return teacher ? (
            <span className="text-foreground">{teacher.name}</span>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<Class['status']>()
          return (
            <Badge variant={STATUS_VARIANT[status] ?? 'outline'} className="capitalize">
              {status}
            </Badge>
          )
        },
      },
      {
        id: 'capacity',
        accessorKey: 'capacity',
        size: 90,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<number>()}</span>
        ),
      },
    ], []),
    refineCoreProps: {
      resource: 'classes',
      pagination: {
        pageSize: 10,
        mode: 'server',
      },
      filters: {
        permanent: [
          ...statusFilters, ...searchFilters,
        ],
      },
      sorters: {
        initial: [
          { field: 'id', order: 'desc' },
        ],
      },
    },
  })

  return (
    <ListView>
      <div className="flex flex-col gap-5">
        <Breadcrumb />

        <h1 className="page-title text-4xl">Classes</h1>

        <div className="intro-row flex flex-col gap-5">
          <p>
            Quick access to essential metrics and management tools for your classes. Monitor performance, track progress, and manage your classes efficiently from this centralized dashboard.
          </p>

          <div className="actions-row flex justify-between items-center gap-5">
            <div className="search-field w-full">
              <Search className="search-icon" />

              <Input
                type="text"
                placeholder="Search by name ..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status ..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>

                  {CLASS_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CreateButton />
            </div>
          </div>
        </div>

        <DataTable table={classTable} />
      </div>
    </ListView>
  )
}

export default ClassesList

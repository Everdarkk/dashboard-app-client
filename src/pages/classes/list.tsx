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
import { useList } from "@refinedev/core"
import { Class } from "@/types"
import { Subject } from "@/types"
import { User } from "@/types"
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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTeacher, setSelectedTeacher] = useState('all')
  const [capacityMinInput, setCapacityMinInput] = useState('')
  const [capacityMaxInput, setCapacityMaxInput] = useState('')

  const { query: subjectsQuery } = useList<Subject>({
    resource: 'subjects',
    pagination: { pageSize: 100 },
  })

  const subjects = subjectsQuery?.data?.data ?? []
  const subjectsLoading = subjectsQuery?.isLoading

  const { query: teachersQuery } = useList<User>({
    resource: 'users',
    filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
    pagination: { pageSize: 100 },
  })

  const teachers = teachersQuery?.data?.data ?? []
  const teachersLoading = teachersQuery?.isLoading

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
    refineCoreProps: useMemo(() => {
      const statusFilters = selectedStatus === 'all' ? [] : [
        { field: 'status', operator: 'eq' as const, value: selectedStatus }
      ]
      const selectedSubjectName = subjects.find(
        (subject) => String(subject.id) === selectedCategory
      )?.name
      const categoryFilters = selectedCategory === 'all' ? [] : [
        { field: 'subject', operator: 'contains' as const, value: selectedSubjectName ?? '' }
      ]
      const teacherFilters = selectedTeacher === 'all' ? [] : [
        { field: 'teacherId', operator: 'eq' as const, value: selectedTeacher }
      ]
      const parsedCapacityMin = Number(capacityMinInput)
      const parsedCapacityMax = Number(capacityMaxInput)
      const hasCapacityMin = capacityMinInput.trim() !== '' && Number.isFinite(parsedCapacityMin) && parsedCapacityMin >= 0
      const hasCapacityMax = capacityMaxInput.trim() !== '' && Number.isFinite(parsedCapacityMax) && parsedCapacityMax >= 0
      const capacityFilters = [
        ...(hasCapacityMin
          ? [{ field: 'capacity', operator: 'gte' as const, value: Math.floor(parsedCapacityMin) }]
          : []),
        ...(hasCapacityMax
          ? [{ field: 'capacity', operator: 'lte' as const, value: Math.floor(parsedCapacityMax) }]
          : []),
      ]
      const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
      ] : []

      return {
        resource: 'classes',
        pagination: {
          pageSize: 10,
          mode: 'server' as const,
        },
        filters: {
          permanent: [...statusFilters, ...categoryFilters, ...teacherFilters, ...capacityFilters, ...searchFilters],
        },
        sorters: {
          initial: [
            { field: 'id', order: 'desc' as const },
          ],
        },
      }
    }, [
      selectedStatus,
      selectedCategory,
      selectedTeacher,
      searchQuery,
      capacityMinInput,
      capacityMaxInput,
      subjects,
    ]),
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

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category ..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>

                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={String(subject.id)} disabled={subjectsLoading}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by teacher ..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>

                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id} disabled={teachersLoading}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min={0}
                placeholder="Min capacity"
                value={capacityMinInput}
                onChange={(e) => setCapacityMinInput(e.target.value)}
              />

              <Input
                type="number"
                min={0}
                placeholder="Max capacity"
                value={capacityMaxInput}
                onChange={(e) => setCapacityMaxInput(e.target.value)}
              />

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

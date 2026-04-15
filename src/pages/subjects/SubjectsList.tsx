import { useMemo, useState } from "react"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEPARTMENT_OPTIONS } from "@/constants"
import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { useTable } from "@refinedev/react-table"
import { Subject } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

const SubjectsList = () => {
  // STATES
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // TABLE
  const subjectTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">{getValue<string>()}</span>
        ),
        filterFn: 'includesString',
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        size: 180,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground truncate line-clamp-2">
            {getValue<string>()}
          </span>
        ),
        filterFn: 'includesString',
      },
    ], []),

    refineCoreProps: useMemo(() => {
      const departmentFilters =
        selectedDepartment === 'all'
          ? []
          : [{ field: 'department', operator: 'eq' as const, value: selectedDepartment }]

      const searchFilters = searchQuery
        ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }]
        : []

      return {
        resource: 'subjects',
        pagination: {
          pageSize: 10,
          mode: 'server' as const,
        },
        filters: {
          permanent: [...departmentFilters, ...searchFilters],
        },
        sorters: {
          initial: [{ field: 'id', order: 'desc' as const }],
        },
      }
    }, [selectedDepartment, searchQuery]),
  })

  return (
    <ListView>
      <div className="flex flex-col gap-5">
        <Breadcrumb />

        <h1 className="page-title text-4xl">Subjects</h1>

        <div className="intro-row flex flex-col gap-5">
          <p>
            Quick access to essential metrics and management tools for your subjects. Monitor
            performance, track progress, and manage your subjects efficiently from this
            centralized dashboard.
          </p>

          <div className="actions-row flex justify-between items-center gap-5">
            <div className="search-field w-full">
              <Search className="search-icon" />

              <Input
                type="text"
                placeholder="Search by name or code ..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department ..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>

                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CreateButton />
            </div>
          </div>
        </div>

        <DataTable table={subjectTable} />
      </div>
    </ListView>
  )
}

export default SubjectsList

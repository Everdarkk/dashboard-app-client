import { useState } from "react"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <ListView>
      <div className="flex flex-col gap-5">
        <Breadcrumb />
        <h1 className="page-title text-4xl">Subjects</h1>
        <div className="intro-row flex flex-col gap-5">
          <p>
            Quick access to essential metrics and management tools for your subjects. Monitor performance, track progress, and manage your subjects efficiently from this centralized dashboard.
          </p>
          <div className="actions-row">
            <div className="search-field">
              <Search className="search-icon" />
              <Input
                type="text"
                placeholder="Search by name ..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </ListView>
  )
}

export default SubjectsList

"use client"

import { Input } from "@/app/_components/ui/input"
import { Button } from "@/app/_components/ui/button"
import { SearchIcon } from "lucide-react"


const Search = () => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Input placeholder="Busque por uma barbearia..." />
        <Button variant="default" >
          <SearchIcon size={20} />
        </Button>
      </div>
    </div>
  )
}

export default Search

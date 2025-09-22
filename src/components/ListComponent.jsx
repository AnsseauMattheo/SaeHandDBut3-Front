import { Button } from "./ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Fragment } from "react"

const ListComponent = ({liste = [], onClick}) => {


 return (
    <ScrollArea className="h-150 w-35 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Joueuses</h4>
        {liste.map((tag) => (
          <Fragment key={tag} >
            <Button onClick={() => console.log(tag)} variant="outline" >{tag}</Button>
        
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  )

    return (
        liste.map((element) => {
            return (<Button variant="outline">{element}</Button>)
        })
    )

}

export default ListComponent
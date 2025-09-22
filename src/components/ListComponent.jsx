import { Button } from "./ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Fragment } from "react"

const ListComponent = ({liste = [], onClick}) => {


    return (
        <ScrollArea className="h-full rounded-md border">
            <div className="p-4">
                <h4 className="mb-4 text-sm leading-none font-medium">Joueuses</h4>
                {liste.map((tag, index) => (
                    <Fragment key={tag}>
                        <Button 
                            onClick={() => {
                                console.log(tag);
                                onClick?.(tag);
                            }} 
                            variant="outline" 
                            className="w-full justify-start mb-2"
                        >
                            {tag}
                        </Button>
                        {index < liste.length - 1 && (
                            <Separator className="my-2" />
                        )}
                    </Fragment>
                ))}
            </div>
        </ScrollArea>
    )


}

export default ListComponent
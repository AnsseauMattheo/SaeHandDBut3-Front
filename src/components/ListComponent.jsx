import { Button } from "./ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Fragment } from "react"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.jsx";

const ListComponent = ({liste = {}, onClick}) => {

    return (
        <ScrollArea className="h-full rounded-md border">
            <div className="p-4">
                <Accordion
                    type="multiple"
                    collapsible
                    className="w-full"
                    defaultValue="item-1"
                >
                    {Object.keys(liste).map((key, index) => (

                        <AccordionItem value={key} key={index}>
                            <AccordionTrigger>{key}</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                {liste[key].map((tag, index) => (
                                    <Fragment key={tag.id}>
                                        <Button
                                            onClick={() => {
                                                onClick?.(tag.nom);
                                            }}
                                            variant="outline"
                                            className="w-full justify-start mb-2"
                                        >
                                            {tag.nom}
                                        </Button>
                                        {index < liste.length - 1 && (
                                            <Separator className="my-2" />
                                        )}
                                    </Fragment>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>


            </div>
        </ScrollArea>
    )


}

export default ListComponent
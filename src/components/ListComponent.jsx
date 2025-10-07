import { Button } from "./ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {Fragment, useEffect} from "react"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.jsx";
import {Check, CheckCircleIcon} from "lucide-react";

const ListComponent = ({liste = {}, onClick}) => {

    useEffect(() => {
        console.log("liste", liste);
    }, [liste]);

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
                                            variant="outline"
                                            className="relative w-full justify-start mb-2"
                                            onClick={() => onClick(tag.id)}
                                        >
                                            {tag.nom}
                                            {tag.selected ? <Check className="absolute right-3 text-green-600" /> : ""}
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
import { Button } from "./ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Fragment, useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.jsx";
import { Check } from "lucide-react";

const ListComponent = ({ liste = {}, nom, id, categorie, onClick, selectAll }) => {
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        console.log("liste", liste);
    }, [liste]);

    const shouldScroll = (text) => text && text.length > 15;

    return (
        <ScrollArea className="h-full rounded-md border">
            <div className="p-2 sm:p-3 lg:p-4">
                <Accordion
                    type="multiple"
                    collapsible="true"
                    className="w-full"
                    defaultValue="item-1"
                >
                    {Object.keys(liste).map((key, index) => (
                        <AccordionItem value={key} key={index}>
                            <AccordionTrigger className="text-xs sm:text-sm">{key}</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-2 sm:gap-3 lg:gap-4 text-balance">
                                <Fragment key={key}>
                                    <Button
                                        variant="outline"
                                        className="relative w-full justify-start mb-1 sm:mb-2 text-xs sm:text-sm py-1 sm:py-2"
                                        onClick={() => selectAll(key)}
                                    >
                                        Tout sélectionner
                                        {categorie[key] ? <Check className="absolute right-2 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> : ""}
                                    </Button>
                                </Fragment>
                                {liste[key].map((tag, index) => (
                                    <Fragment key={tag[id]}>
                                        <Button
                                            variant="outline"
                                            className="relative w-full mb-1 sm:mb-2 text-xs sm:text-sm py-1 sm:py-2 text-left"
                                            onClick={() => onClick(tag[id])}
                                            onMouseEnter={() => setHoveredId(tag[id])}
                                            onMouseLeave={() => setHoveredId(null)}
                                            style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}
                                        >
                                            <span
                                                style={{
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    display: 'block',
                                                    ...(shouldScroll(tag[nom]) && hoveredId === tag[id]
                                                            ? {}
                                                            : {
                                                                whiteSpace: 'nowrap'
                                                            }
                                                    )
                                                }}
                                            >
                                                <span
                                                    style={
                                                        shouldScroll(tag[nom]) && hoveredId === tag[id]
                                                            ? {
                                                                display: 'inline-block',
                                                                animation: 'scroll-text 3s linear infinite',
                                                                whiteSpace: 'nowrap',
                                                                paddingRight: '2rem'
                                                            }
                                                            : {}
                                                    }
                                                >
                                                    {tag[nom]}
                                                </span>
                                            </span>
                                            <span style={{ width: '24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {tag.selected ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> : ""}
                                            </span>
                                        </Button>
                                    </Fragment>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <style>{`
                @keyframes scroll-text {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </ScrollArea>
    )
}

export default ListComponent
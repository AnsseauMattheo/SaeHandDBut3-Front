import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
                       ...props
                   }) {
    return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
                           className,
                           ...props
                       }) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn("border-b last:border-b-0", className)}
            {...props} />
    );
}

function AccordionTrigger({
                              className,
                              children,
                              ...props
                          }) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium outline-none",
                    "transition-colors duration-200 ease-in-out",
                    "hover:text-primary",
                    "data-[state=open]:text-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
                    className
                )}
                {...props}>
                {children}
                <ChevronDownIcon
                    className="size-4 shrink-0 text-muted-foreground transition-all duration-200 ease-in-out group-hover:text-primary group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary"
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({
                              className,
                              children,
                              ...props
                          }) {
    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
            {...props}>
            <div className={cn("pt-0 pb-4", className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

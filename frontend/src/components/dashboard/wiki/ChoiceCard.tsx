import { ArrowRight } from "lucide-react";
import { Button } from "shadcn/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "shadcn/components/ui/card";
import { ChoiceCardProps } from "types";

const ChoiceCard = (props: ChoiceCardProps) => {
    return (
        <Card className="border-none shadow-none w-[400px]">
            <img src={props?.image} className="w-[400px] rounded-lg" />
            <CardHeader className="px-0">
                <CardTitle>{props?.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <p>{props?.description}</p>
            </CardContent>
            <CardFooter className="flex gap-2 px-0">
                <Button size={"lg"} variant={"outline"} onClick={() => window.location.href = "/exhibit/map?type=" + props?.type}>View on map</Button>
                <Button className="flex-grow px-3" size={"lg"} onClick={() => window.location.href = "/exhibit/wiki/list?type=" + props?.type}>
                    View all<span className="flex-grow"></span><ArrowRight />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ChoiceCard
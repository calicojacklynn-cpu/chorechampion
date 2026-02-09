import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function RewardsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Rewards</h1>
                    <p className="text-muted-foreground">Motivate your champions with exciting rewards.</p>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Reward
                </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                    <CardContent className="flex items-center justify-center h-48">
                        <p className="text-muted-foreground">No rewards added yet. Start by adding a new reward.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

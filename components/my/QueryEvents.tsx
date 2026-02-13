import { Text } from "@/components/ui/text";
import { UseQueryResult } from "@tanstack/react-query";

export default function QueryEvent({query}: {query: UseQueryResult}){

    if (query.isLoading){
        return (<Text>Loading...</Text>)
    }

    if (query.isError){
        console.log(query.error);
        return (<Text>Error</Text>)
    }

}
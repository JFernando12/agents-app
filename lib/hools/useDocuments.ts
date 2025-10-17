import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiDocuments } from "../api/documents"

export const useDocuments = ({ serviceId }: { serviceId?: string }) => {
    return useQuery({
        queryKey: ["documents", serviceId],
        queryFn: () => apiDocuments.getDocuments({ serviceId }),
    })
}

export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: apiDocuments.uploadDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        }
    })
}
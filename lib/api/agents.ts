export const getAgents = async () => {
    const response = await fetch(`${process.env.API_URL}/services`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`
        }
    })
    const data = await response.json();
    const formattedData = data.services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        model: service.model,
        customPrompt: service.custom_prompt,
        temperature: service.temperature,
        maxTokens: service.max_tokens,
        topP: service.top_p,
        topK: service.top_k,
        icon: service.icon
    }));

    return formattedData;
}
import {createOpencode, OpencodeClient} from "@opencode-ai/sdk";

interface IOpencode {
    client: OpencodeClient
    server: {
        url: string
        close(): void
    }
}

interface IPromptResponse {
    response: string;
    reasoning: string;
}

export class Jenny {
    private opencode: IOpencode | undefined;
    private sessionId: string = "__UNKNOWN__";

    async initialiseAsync() {
        this.opencode = await createOpencode({
            hostname: "127.0.0.1",
            port: 6969,
            config: {
                model: "opencode/minimax-m2.5-free",
            },
        })

        await this.createSession();
        const re = await this.promptAsync("Explain the concept of recursion in programming in simple terms.");
        console.log('@> MODEL::: ', re);

        const r1e = await this.promptAsync("What is 2+2?");
        console.log('@> MODEL::: ', r1e)

        const r2e = await this.promptAsync("What was my first question?");
        console.log('@> MODEL::: ', r2e)
        //
        // await this.listModels();
    }

    async listModels() {
        const response = await this.opencode?.client.provider.list();
        
        console.log('\n=== Available Models ===');
        
        const providers = response?.data?.all ?? [];
        for (const provider of providers) {
            console.log(`\nProvider: ${provider.name} (${provider.id})`);
            console.log('Models:');
            
            const models = provider.models ?? {};
            for (const [modelId, model] of Object.entries(models)) {
                console.log(`  - ${model.name || modelId}`);
                console.log(`    ID: ${modelId}`);
                //@ts-ignore
                console.log(`    Reasoning: ${model.capabilities?.reasoning ?? false}`);
                //@ts-ignore
                console.log(`    Tools: ${model.capabilities?.toolcall ?? false}`);
                console.log(`    Context: ${model.limit?.context ?? 'N/A'}`);
                console.log(`    Cost: $${model.cost?.input ?? '?'}/M input, $${model.cost?.output ?? '?'}/M output`);
            }
        }
    }

    async createSession() {
        const session = await this.opencode?.client.session.create({body: {title: 'jenny-tutor'}});
        if (session?.data?.id) {
            this.sessionId = session?.data?.id
            console.log('@> session created', this.sessionId);
        }
    }


    async promptAsync(prompt: string): Promise<IPromptResponse> {
        if (!this.opencode?.client || !this.sessionId) {
            throw new Error("Jenny not initialized. Call initialiseAsync() first.");
        }

        const result = await this.opencode.client.session.prompt({
            path: {id: this.sessionId},
            body: {parts: [{type: "text", text: prompt}]}
        });

        const response = result.data;

        const textPart = response?.parts.find(p => p.type === "text");
        const reasoningPart = response?.parts.find(p => p.type === "reasoning");
        const answer = textPart?.text?.trim() ?? "";
        const reasoning = reasoningPart?.text?.trim() ?? "";

        return {
            response: answer,
            reasoning,
        };
    }
}
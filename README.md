# genkit-image-gen
An interior design inspiration flow using Genkit and Gemini

1. Install Genkit

	```shell
	npm install -g genkit-cli
	```
2. Clone the repository
	```shell
	git clone https://github.com/mjchristy/genkit-image-gen.git
	cd genkit-image-gen
	```
3. Install the dependencies
	```shell
	npm install
	```
4. Generate an API key from https://aistudio.google.com/api-keys
5. Set your API key as an environment variable
	```shell
	export GEMINI_API_KEY=AIayiuMyAPIKeyasoeifnaskefi982u3
	```
	> [!TIP]
	> You must replace `AIayiuMyAPIKeyasoeifnaskefi982u3` with your API key
6. Start the Genkit UI:

	```shell
	genkit start -- npx tsx --watch index.ts
	```
7. Click **Prompts**
8. Update the prompt to the decor style you would like to use
	```json
	{
    		"decorStyle": "modern"
	}
	```

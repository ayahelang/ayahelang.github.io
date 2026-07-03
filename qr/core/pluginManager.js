/**
 * Plugin Manager
 */

const PluginManager = {

    async run(pluginName){

        console.log("Loading Plugin :",pluginName);

        const script=document.createElement("script");

        script.src="plugins/"+pluginName+"/plugin.js";

        script.onload=()=>{

            if(window.Plugin){

                const plugin=new window.Plugin();

                plugin.run();

            }

        };

        document.body.appendChild(script);

    }

};

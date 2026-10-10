/**
 * SilverQR Engine
 * Version 1.0
 */

const SilverQR = {

    version: "1.0.0",

    settings: {},

    rules: [],

    plugins: {},

    currentRule: null,

    currentPlugin: null,

    mode: "AUTO",

    async boot() {

        console.log("SilverQR Booting...");

        this.settings = await Loader.json("config/settings.json");

        this.rules = await Loader.json("config/rules.json");

        const scheduler = new Scheduler(this.rules);

        this.currentRule = scheduler.getCurrentRule();

        if (!this.currentRule) {

            document.body.innerHTML = "<h2>No Rule Found</h2>";

            return;

        }

        this.currentPlugin = this.currentRule.plugin;

        console.log("Rule :", this.currentRule);

        await PluginManager.run(this.currentPlugin);

    }

};

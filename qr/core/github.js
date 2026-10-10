/*
=========================================================
SilverQR CMS
core/github.js
Version : 0.1
Author  : Teddy Mulyana & ChatGPT
=========================================================
*/

const GitHub = {

    token: "",
    repo: "",
    branch: "main",

    init() {

        this.token = Storage.load("githubPAT", "");
        this.repo = Storage.load("githubRepo", "");
        this.branch = Storage.load("githubBranch", "main");

    },

    saveSetting(token, repo, branch = "main") {

        this.token = token;
        this.repo = repo;
        this.branch = branch;

        Storage.save("githubPAT", token);
        Storage.save("githubRepo", repo);
        Storage.save("githubBranch", branch);

    },

    isReady() {

        return (
            this.token !== "" &&
            this.repo !== ""
        );

    },

    headers() {

        return {

            "Authorization": "token " + this.token,
            "Accept": "application/vnd.github+json"

        };

    },

    api(path) {

        return "https://api.github.com/repos/" +
            this.repo +
            "/" +
            path;

    },

    async getFile(path) {

        if (!this.isReady()) {

            throw "GitHub belum dikonfigurasi.";

        }

        const url =
            this.api("contents/" + path + "?ref=" + this.branch);

        const response = await fetch(url, {

            headers: this.headers()

        });

        if (!response.ok) {

            throw "File tidak ditemukan : " + path;

        }

        return await response.json();

    },

    async readText(path) {

        const file = await this.getFile(path);

        return atob(file.content.replace(/\n/g, ""));

    },

    async readJSON(path) {

        const text = await this.readText(path);

        return JSON.parse(text);

    },

    async updateFile(path, content, message) {

        const file = await this.getFile(path);

        const body = {

            message: message,

            branch: this.branch,

            sha: file.sha,

            content: btoa(
                unescape(
                    encodeURIComponent(content)
                )
            )

        };

        const response = await fetch(

            this.api("contents/" + path),

            {

                method: "PUT",

                headers: {

                    ...this.headers(),

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(body)

            }

        );

        return await response.json();

    }

};

GitHub.init();

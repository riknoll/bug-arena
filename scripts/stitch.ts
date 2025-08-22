async function getProject(url: string): Promise<string> {
    let projectId = url.split('/').pop();
    projectId = projectId.split("?")[0];
    projectId = projectId.split("#")[0];

    const scriptUri = `https://makecode.com/api/${projectId}/text`;

    const resp = await fetch(scriptUri);
    return resp.text();
}


interface BugDesign {
    legLength: number;
    bodyRadius: number;
    noseRadius: number;
    colorPalette: number[];
}

interface ParsedProject {
    url: string;
    name: string;
    bug: BugDesign;
    script: string;
}


export function parseProject(project: string, url: string): ParsedProject {
    const text: {[index: string]: string} = JSON.parse(project);
    let mainTS = text["main.ts"];

    let name: string | undefined;
    let palette: number[] | undefined;
    let noseRadius: number | undefined;
    let bodyRadius: number | undefined;
    let legLength: number | undefined;

    mainTS = mainTS.replace(/hourOfAi\._setName\("([^"]+)"\)(?:;?)/g, (match, captured: string) => {
        name = captured
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setPalette\(\[([^\]]+)\]\)(?:;?)/g, (match, captured: string) => {
        palette = captured.split(",").map(x => parseInt(x.trim()));
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setBodyRadius\(([^\)]+)\)(?:;?)/g, (match, captured: string) => {
        bodyRadius = parseInt(captured)
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setNoseRadius\(([^\)]+)\)(?:;?)/g, (match, captured: string) => {
        noseRadius = parseInt(captured)
        return "";
    });
    mainTS = mainTS.replace(/hourOfAi\._setLegLength\(([^\)]+)\)(?:;?)/g, (match, captured: string) => {
        legLength = parseInt(captured)
        return "";
    });

    const bug = {
        legLength: legLength || 5,
        bodyRadius: bodyRadius || 5,
        noseRadius: noseRadius || 2,
        colorPalette: palette || [4, 15, 2]
    }

    mainTS = mainTS.replace(/hourOfAi\./gm, "agent.");

    const script = `
    hourOfAi.registerProject(
        "${name || "Unknown"}",
        ${JSON.stringify(bug)},
        (agent => {
            ${mainTS}
        })
    );
    `

    return {
        url,
        name,
        bug,
        script
    }
}

async function main() {
    const projects: string[] = [
        "https://makecode.com/_4j5JUpPA6Kig",
        "https://makecode.com/_Yvj7WrU7WEev",
        "https://makecode.com/_gRYd7sPUsA5m",
        "https://makecode.com/_M196fjKbtgHs",
        "https://makecode.com/_g8JT26YRbHUC",
        "https://makecode.com/_erbTiLPTcKcv",
        "https://makecode.com/_17bAekJ52R7b",
        "https://makecode.com/_ayrCekdTaKWb",
        "https://makecode.com/_A0RUKPPhz4T0"

    ];

    const parsedProjects: ParsedProject[] = [];

    for (const url of projects) {
        const project = await getProject(url);
        const parsed = parseProject(project, url);
        parsedProjects.push(parsed);
    }

    let out = "";

    for (const project of parsedProjects) {
        out += `// Project: ${project.name}\n`;
        out += `// URL: ${project.url}\n`;
        out += project.script + "\n\n";
    }

    out += `hourOfAi.initRunner();\n`;

    console.log(out);
}


main();
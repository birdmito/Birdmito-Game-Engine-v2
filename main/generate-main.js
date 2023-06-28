const fs = require("fs");
const { Project } = require("ts-morph");

function generateMainTs() {
    // initialize
    const project = new Project({
        tsConfigFilePath: "./tsconfig.json",
    });
    const sourceFiles = project.getSourceFiles();
    const behaviourClassDeclarations = sourceFiles
        .filter((sourceFile) => !sourceFile.getFilePath().includes("__tests__"))
        .map(extractBehaviours)
        .flat();
    const output = project.createSourceFile("./src/temp.ts");
    const registerAllSourceCodesMethod = output.addFunction({
        isExported: true,
        name: "registerAllSourceCodes",
    });

    behaviourClassDeclarations.forEach((behavoiur) => {
        registerAllSourceCodesMethod.addStatements(`registerBehaviourClass(${behavoiur.getName()})`);
    });
    output.fixMissingImports();
    const content = output.print();
    fs.writeFileSync("./src/register.ts", content, "utf-8");
}

/**
 *
 * @param {import('ts-morph').SourceFile} sourceFile
 */
function extractBehaviours(sourceFile) {
    return sourceFile.getClasses().filter(isBehaviour);
}

/**
 *
 * @param {import('ts-morph').ClassDeclaration} classDeclaration
 */
function isBehaviour(classDeclaration) {
    const className = classDeclaration.getName();
    const baseClass = classDeclaration.getBaseClass();
    if (!baseClass) {
        return false;
    }
    const baseClassName = baseClass.getName();
    if (baseClassName === "Behaviour") {
        return className !== "Binding";
    } else if (baseClassName === "Binding") {
        return true;
    } else {
        return false;
    }
}

module.exports.generateMainTs = generateMainTs;

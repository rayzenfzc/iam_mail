// ============================================
// Figma Plugin: i AM Token Importer
// Run once, no UI - imports 26 color variables
// ============================================

const tokens = {
    "Default": {
        "Bg / Base": "#ffffff",
        "Bg / Surface": "#f8fafc",
        "Bg / Elevated": "#ffffff",
        "Bg / Hover": "#f1f5f9",
        "Bg / Active": "#e2e8f0",
        "Text / Primary": "#0f172a",
        "Text / Secondary": "#475569",
        "Text / Tertiary": "#94a3b8",
        "Text / Inverse": "#ffffff",
        "Text / Disabled": "#cbd5e1",
        "Border / Default": "#e2e8f0",
        "Border / Strong": "#cbd5e1",
        "Border / Focus": "#6366f1",
        "Border / Error": "#ef4444",
        "Accent / Primary": "#6366f1",
        "Accent / Hover": "#4f46e5",
        "Accent / Active": "#4338ca",
        "Accent / Subtle": "#eef2ff",
        "Status / Success": "#10b981",
        "Status / Success Bg": "#d1fae5",
        "Status / Warning": "#f59e0b",
        "Status / Warning Bg": "#fef3c7",
        "Status / Error": "#ef4444",
        "Status / Error Bg": "#fee2e2",
        "Status / Info": "#3b82f6",
        "Status / Info Bg": "#dbeafe"
    },
    "Superhuman": {
        "Bg / Base": "#000000",
        "Bg / Surface": "#0a0a0a",
        "Bg / Elevated": "#141414",
        "Bg / Hover": "#1a1a1a",
        "Bg / Active": "#262626",
        "Text / Primary": "#ffffff",
        "Text / Secondary": "#a1a1aa",
        "Text / Tertiary": "#52525b",
        "Text / Inverse": "#000000",
        "Text / Disabled": "#3f3f46",
        "Border / Default": "#27272a",
        "Border / Strong": "#3f3f46",
        "Border / Focus": "#818cf8",
        "Border / Error": "#f87171",
        "Accent / Primary": "#818cf8",
        "Accent / Hover": "#6366f1",
        "Accent / Active": "#4f46e5",
        "Accent / Subtle": "#1e1b4b",
        "Status / Success": "#34d399",
        "Status / Success Bg": "#064e3b",
        "Status / Warning": "#fbbf24",
        "Status / Warning Bg": "#78350f",
        "Status / Error": "#f87171",
        "Status / Error Bg": "#7f1d1d",
        "Status / Info": "#60a5fa",
        "Status / Info Bg": "#1e3a8a"
    }
};

// Convert hex to Figma RGB (0-1 range)
function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw new Error(`Invalid hex: ${hex}`);
    return {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    };
}

// Main import function
async function importTokens() {
    const COLLECTION_NAME = "i AM token";

    // Step 1: Delete existing collection if it exists
    const existingCollections = figma.variables.getLocalVariableCollections();
    for (const collection of existingCollections) {
        if (collection.name === COLLECTION_NAME) {
            collection.remove();
            console.log("Deleted existing collection");
        }
    }

    // Step 2: Create new collection
    const collection = figma.variables.createVariableCollection(COLLECTION_NAME);
    console.log("Created collection: " + COLLECTION_NAME);

    // Step 3: Setup modes - rename first mode to "Default", add "Superhuman"
    const defaultModeId = collection.modes[0].modeId;
    collection.renameMode(defaultModeId, "Default");
    const superhumanModeId = collection.addMode("Superhuman");
    console.log("Created modes: Default, Superhuman");

    // Step 4: Create all variables
    const variableNames = Object.keys(tokens["Default"]);
    let count = 0;

    for (const varName of variableNames) {
        const variable = figma.variables.createVariable(varName, collection, "COLOR");

        // Set Default mode value
        const defaultHex = tokens["Default"][varName as keyof typeof tokens["Default"]];
        variable.setValueForMode(defaultModeId, hexToRgb(defaultHex));

        // Set Superhuman mode value
        const superhumanHex = tokens["Superhuman"][varName as keyof typeof tokens["Superhuman"]];
        variable.setValueForMode(superhumanModeId, hexToRgb(superhumanHex));

        count++;
    }

    console.log(`Created ${count} variables`);

    // Step 5: Show success and close
    figma.notify(`✅ Imported ${count} variables to "${COLLECTION_NAME}"`, { timeout: 5000 });
    figma.closePlugin();
}

// Run
importTokens();

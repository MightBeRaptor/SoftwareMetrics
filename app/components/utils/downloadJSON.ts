export function downloadJSON(data: any, filename: string = "misuse_cases.json") {
    const jsonString = JSON.stringify(data, null, 2); // pretty print
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

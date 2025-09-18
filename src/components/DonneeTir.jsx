function caseToCoords(caseNumber, cols = 15) {
    const row = Math.ceil(caseNumber / cols);
    const col = ((caseNumber - 1) % cols) + 1;
    return { row, col };
}

// Fonction utilitaire pour un bloc fusionné
function getBlockProps(cases, cols = 15) {
    const coords = cases.map((c) => caseToCoords(c, cols));

    const row = coords[0].row; // toutes tes cases sont sur la même ligne
    const colStart = Math.min(...coords.map((c) => c.col));
    const colEnd = Math.max(...coords.map((c) => c.col));

    return {
        row,
        colStart,
        colSpan: colEnd - colStart + 1,
    };
}

const DonneTirs = () => {
    const totalCases = 150;
    const cols = 15;

    const blocks = [
        [94],
        [80],
        [66],
        [68],
        [70],
        [86],
        [102],
        [53],
        [38],
        [50],
        [56],
        [34],
        [42],
    ];

    const caseToBlock = {};
    blocks.forEach((block) => {
        block.forEach((c, i) => {
            caseToBlock[c] = { block, isFirst: i === 0 };
        });
    });

    return (
        <>
            <div className="absolute inset-0 grid grid-cols-15 grid-rows-10 gap-4 p-6 w-full aspect-[15/10]">
                {Array.from({ length: totalCases }).map((_, i) => {
                    const caseNum = i + 1;

                    if (caseToBlock[caseNum]) {
                        const { block, isFirst } = caseToBlock[caseNum];
                        const { row, col } = caseToCoords(caseNum, cols);

                        if (isFirst) {
                            // Case "maîtresse" du bloc
                            return (
                                <div
                                    key={caseNum}
                                    className={`row-start-${row} col-start-${col} col-span-${block.length} bg-red-500/70 flex items-center justify-center text-white rounded`}
                                >
                                    Bloc {block.join("-")}
                                </div>
                            );
                        } else {
                            // Les autres cases du bloc → invisibles
                            return (
                                <div
                                    key={caseNum}
                                    className="opacity-0 pointer-events-none"
                                />
                            );
                        }
                    }

                    // Cases normales (non utilisées) → invisibles
                    return (
                        <div
                            key={caseNum}
                            className="opacity-0 pointer-events-none"
                        />
                    );
                })}
            </div>
        </>
    )
}

export default DonneTirs;
export const reservationsMock = {
    "count": 50,
    "next": null,
    "previous": null,
    "results": [
        // Przyszłe rezerwacje
        ...Array.from({ length: 75 }, (_, i) => ({
            id: i + 1,
            start_date: `2025-07-${String(i + 1).padStart(2, "0")}`,
            end_date: `2025-07-${String(i + 2).padStart(2, "0")}`,
            status: i % 2 === 0 ? "confirmed" : "pending",
            offer: {
                id: 100 + i,
                title: `Oferta ${i + 1}`,
                city: `Miasto ${i + 1}`,
                country: "Polska",
                img_url: `https://picsum.photos/id/${1010 + i}/300/300`
            }
        })),
        // Archiwalne rezerwacje
        ...Array.from({ length: 85 }, (_, i) => ({
            id: i + 26,
            start_date: `2023-07-${String(i + 1).padStart(2, "0")}`,
            end_date: `2023-07-${String(i + 2).padStart(2, "0")}`,
            status: i % 3 === 0 ? "canceled" : "confirmed",
            offer: {
                id: 200 + i,
                title: `Archiwalna oferta ${i + 1}`,
                city: `Miasto ${i + 26}`,
                country: "Polska",
                img_url: `https://picsum.photos/id/${1020 + i}/300/300`
            }
        }))
    ]
};
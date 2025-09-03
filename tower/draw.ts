namespace hourOfAi.tower {
    export function drawTower(left: number, bottom: number, offset: number, totalSections: number, anchorY: number, zoom: number) {
        offset |= 0;
        if (zoom === 1) {
            const sectionHeight = imgs.tower_section.height - 10;
            const totalHeight = sectionHeight * totalSections;
            for (let i = 0; i < totalSections; i++) {
                const y = i * sectionHeight;
                const offsetY = bottom - y + offset - imgs.tower_section.height;
                if (offsetY < -imgs.tower_section.height) break;
                if (offsetY > screen.height) continue;
                screen.drawTransparentImage(imgs.tower_section, left, offsetY);
            }

            screen.drawTransparentImage(
                imgs.tower_roof,
                left,
                bottom - totalHeight + offset - imgs.tower_roof.height
            )
        }
        else {
            const imageHeight = imgs.tower_section.height * zoom;
            const imageWidth = imgs.tower_section.width * zoom;
            const adjustedLeft = (left + ((imgs.tower_section.width) >> 1)) - (imageWidth >> 1);
            const sectionHeight = (imgs.tower_section.height - 10) * zoom;
            offset = offset * zoom;

            const totalHeight = sectionHeight * totalSections;

            const anchorOffset = (anchorY * zoom) - anchorY;

            for (let i = 0; i < totalSections; i++) {
                const y = i * sectionHeight;
                const offsetY = bottom - y + offset - imageHeight + anchorOffset;
                if (y !== 0) {
                    if (offsetY < -imageHeight) break;
                    if (offsetY > screen.height) continue;
                }

                screen.blit(
                    adjustedLeft,
                    offsetY,
                    imageWidth,
                    imageHeight,
                    imgs.tower_section,
                    0,
                    0,
                    imgs.tower_section.width,
                    imgs.tower_section.height,
                    true,
                    false
                )
            }

            screen.blit(
                adjustedLeft,
                bottom - totalHeight + offset - ((imgs.tower_roof.height) * zoom) + anchorOffset,
                imgs.tower_roof.width * zoom,
                imgs.tower_roof.height * zoom,
                imgs.tower_roof,
                0,
                0,
                imgs.tower_roof.width,
                imgs.tower_roof.height,
                true,
                false
            )
        }
    }
}
import axe from 'axe-core';

export function auditAccessibility(container) {
    return axe.run(container, {
        rules: {
            // JSDOM cannot calculate rendered color contrast.
            'color-contrast': { enabled: false },
        },
    });
}

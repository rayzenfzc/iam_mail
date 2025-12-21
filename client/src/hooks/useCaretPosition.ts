import { useRef } from 'react';

export const useCaretPosition = () => {
    const getCaretCoordinates = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return { x: 0, y: 0 };

        const range = selection.getRangeAt(0).cloneRange();

        // We need to insert a temporary span to get accurate coordinates
        // if we are in a contentEditable or text node
        const span = document.createElement('span');
        span.textContent = '\u200b'; // Zero-width space
        range.insertNode(span);

        const rect = span.getBoundingClientRect();

        // Clean up
        if (span.parentNode) {
            span.parentNode.removeChild(span);
        }

        // Merge adjacent text nodes to normalize the DOM again potentially
        // (Optional but good practice if editing heavily)

        return {
            x: rect.left,
            y: rect.bottom
        };
    };

    return { getCaretCoordinates };
};

// Alternative basic version for textareas if needed, though we will likely use 
// contentEditable or overlay for the composer. 
// For now, let's assume we might need a textarea strategy if the composer is a textarea.

export const getTextAreaCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    const {
        top,
        left,
    } = element.getBoundingClientRect();

    // Create a mirror div to calculate position
    const div = document.createElement('div');
    const style = window.getComputedStyle(element);
    const copyStyle = [
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'letter-spacing',
        'line-height',
        'text-transform',
        'word-spacing',
        'text-indent',
        'padding',
        'border',
        'box-sizing'
    ] as const;

    copyStyle.forEach(prop => {
        div.style[prop as any] = style.getPropertyValue(prop);
    });

    div.style.position = 'absolute';
    div.style.top = '0px';
    div.style.left = '-9999px';
    div.style.width = style.width;
    div.style.height = 'auto'; // Shrink to fit content
    div.style.whiteSpace = 'pre-wrap';
    div.style.overflow = 'hidden';

    div.textContent = element.value.substring(0, position);

    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);

    document.body.appendChild(div);

    const { offsetLeft: spanLeft, offsetTop: spanTop } = span;

    document.body.removeChild(div);

    return {
        x: left + spanLeft,
        y: top + spanTop
    };
};

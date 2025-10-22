// Function to show notification modal. If `anchorEl` is provided and visible in the viewport,
// the notification will be positioned near that element. Otherwise it falls back to the
// top-right toast position so it's always visible to the user.
function showNotificationModal(message, type = 'success', anchorEl = null) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = `v-modal v-modal-${type}`;
    modal.setAttribute('role', 'status');
    modal.setAttribute('aria-live', 'polite');

    // Create content
    const content = document.createElement('div');
    content.className = 'v-modal-content';
    content.innerHTML = `<p>${message}</p>`;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'v-modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close notification');

    modal.appendChild(content);
    modal.appendChild(closeBtn);

    // Add to body (position is fixed via CSS, we will override coordinates if anchoring)
    document.body.appendChild(modal);

    // Hide while we measure/position to avoid flicker
    modal.style.visibility = 'hidden';
    modal.style.left = '-9999px';

    // After it's in the DOM, compute placement
    requestAnimationFrame(() => {
        const mRect = modal.getBoundingClientRect();
        let anchored = false;

        try {
            if (anchorEl && typeof anchorEl.getBoundingClientRect === 'function') {
                const aRect = anchorEl.getBoundingClientRect();

                // We will attempt to anchor on larger screens; if the anchor is off-screen
                // vertically (e.g. footer below viewport), we still align horizontally and
                // clamp vertically into view so the user sees the notification near the footer.
                const enoughSpace = window.innerWidth > 480; // use anchor only on larger screens

                if (enoughSpace) {
                    // Try to place near anchor even if partially off-screen by clamping into viewport
                    const margin = 12;
                    // Preferred: above anchor
                    let top;
                    const minTop = margin;
                    const maxTop = window.innerHeight - mRect.height - margin;

                    // If anchor is below the viewport, show the notification near the bottom of the viewport
                    if (aRect.top >= window.innerHeight) {
                        top = maxTop; // clamp to bottom area
                    } else {
                        // Prefer placing above the anchor, otherwise below if not enough space
                        top = aRect.top - mRect.height - margin;
                        if (top < minTop) {
                            top = aRect.bottom + margin; // place below anchor
                        }
                        // Clamp into viewport
                        top = Math.min(Math.max(top, minTop), maxTop);
                    }

                    let left = aRect.left + (aRect.width / 2) - (mRect.width / 2);
                    // Clamp left within viewport padding
                    const minLeft = 12;
                    const maxLeft = window.innerWidth - mRect.width - 12;
                    left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));

                    modal.style.top = `${Math.round(top)}px`;
                    modal.style.left = `${Math.round(left)}px`;
                    modal.style.right = 'auto';
                    modal.dataset.position = 'anchor';
                    anchored = true;

                    // Add an arrow pointing to the anchor horizontally (create or reuse)
                    if (!modal.querySelector('.v-modal-arrow')) {
                        const arrow = document.createElement('div');
                        arrow.className = 'v-modal-arrow';
                        modal.appendChild(arrow);
                    }
                    // Position arrow horizontally centered to the anchor
                    const arrowEl = modal.querySelector('.v-modal-arrow');
                    const anchorCenter = aRect.left + aRect.width / 2;
                    const arrowLeft = Math.min(Math.max(anchorCenter - left - 8, 8), mRect.width - 16);
                    arrowEl.style.left = `${Math.round(arrowLeft)}px`;
                }
            }
        } catch (err) {
            // If anything goes wrong with placement, fall back to top-right
            anchored = false;
        }

        if (!anchored) {
            // Fallback: stack top-right notifications so each new one sits below the previous
            const existing = Array.from(document.querySelectorAll('.v-modal[data-position="tr"]'));
            const gap = 8;
            const baseTop = 24;
            const top = baseTop + existing.length * (mRect.height + gap);
            modal.style.top = `${top}px`;
            modal.style.right = '24px';
            modal.style.left = 'auto';
            modal.dataset.position = 'tr';
        }

        // Reveal with entry animation
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';

        // Focus management: move focus to close button for accessibility
        closeBtn.focus({ preventScroll: true });
    });

    // Close helper
    function removeModal() {
        modal.style.animation = 'slideOutRight 0.28s ease-out';
        // detach key listener
        window.removeEventListener('keydown', onKeyDown);
        setTimeout(() => {
            if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
        }, 300);
    }

    // Close button
    closeBtn.addEventListener('click', removeModal);

    // Close on ESC
    function onKeyDown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            removeModal();
        }
    }
    window.addEventListener('keydown', onKeyDown);

    // Auto-dismiss after 5s
    const autoTimer = setTimeout(() => {
        if (modal && modal.isConnected) removeModal();
    }, 5000);

    // Ensure timer is cleared if removed manually
    modal.addEventListener('remove', () => clearTimeout(autoTimer));
}

// Add slide out animation (and keep it if file re-inserted)
if (!document.getElementById('v-notif-animations')) {
    const slideOutStyles = document.createElement('style');
    slideOutStyles.id = 'v-notif-animations';
    slideOutStyles.textContent = `
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
}
@keyframes slideInFromRight {
    from { transform: translateX(12px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
.v-modal { animation: slideInFromRight 0.18s ease-out; }
`;
    document.head.appendChild(slideOutStyles);
}
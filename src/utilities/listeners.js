export const agregarListeners = () => {
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });

    document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });

    document.addEventListener('gestureend', (e) => {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });

}
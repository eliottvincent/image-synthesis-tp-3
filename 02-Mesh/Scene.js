// Définition de la classe Scene

// superclasses et classes nécessaires
Requires("Grid");
Requires("Pyramide");
Requires("Cow");


class Scene
{
    /** constructeur */
    constructor()
    {
        // créer les objets à dessiner
        this.m_Grid = new Grid(5, 5);
        this.m_Pyramide = new Pyramide();
        this.m_Cow = new Cow();

        // couleur du fond : gris très clair
        gl.clearColor(0.9, 0.9, 0.9, 1.0);

        // activer le depth buffer
        gl.enable(gl.DEPTH_TEST);

        // activer la suppression des faces cachées
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        // matrices
        this.m_MatP = mat4.create();
        this.m_MatV = mat4.create();
        this.m_MatVM = mat4.create();
    }


    /**
     * appelée quand la taille de la vue OpenGL change
     * @param width : largeur en nombre de pixels de la fenêtre
     * @param height : hauteur en nombre de pixels de la fenêtre
     */
    onSurfaceChanged(width, height)
    {
        // met en place le viewport
        gl.viewport(0, 0, width, height);

        // matrice de projection
        mat4.perspective(this.m_MatP, Utils.radians(18.0), width / height, 0.1, 30.0);
    }


    /**
     * Dessine l'image courante
     */
    onDrawFrame()
    {
        // effacer l'écran
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        // positionner la caméra
        mat4.identity(this.m_MatV);
        mat4.translate(this.m_MatV, this.m_MatV, vec3.fromValues(0, -0.5, -15));

        // rotation pour orienter la scène
        mat4.rotateX(this.m_MatV, this.m_MatV, Utils.radians(20.0));
        mat4.rotateY(this.m_MatV, this.m_MatV, Utils.radians(-30.0));

        // dessiner la grille
        this.m_Grid.onDraw(this.m_MatP, this.m_MatV);

        // dessiner la pyramide en (-2, 0, 0)
        mat4.translate(this.m_MatVM, this.m_MatV, vec3.fromValues(-2, 0, 0));
        this.m_Pyramide.onDraw(this.m_MatP, this.m_MatVM);

        // dessiner la vache en (+1, 0, 0) en la réduisant à 20% de sa taille
        mat4.translate(this.m_MatVM, this.m_MatV, vec3.fromValues(+1, 0, 0));
        mat4.scale(this.m_MatVM, this.m_MatVM, vec3.fromValues(0.2, 0.2, 0.2));
        this.m_Cow.onDraw(this.m_MatP, this.m_MatVM);
    }


    /** supprime tous les objets de cette scène */
    destroy()
    {
        this.m_Grid.destroy();
        this.m_Pyramide.destroy();
        this.m_Cow.destroy();
    }
}

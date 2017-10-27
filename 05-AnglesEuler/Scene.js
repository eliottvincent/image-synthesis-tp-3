// Définition de la classe Scene

// superclasses et classes nécessaires
Requires("Grid");
Requires("Avion");


class Scene
{
    /** constructeur */
    constructor()
    {
        // créer les objets à dessiner
        this.m_Triedre = new Triedre();
        this.m_Grid = new Grid(5, 5);
        this.m_Avion = new Avion();

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


    onSurfaceChanged(width, height)
    {
        // met en place le viewport
        gl.viewport(0, 0, width, height);

        // matrice de projection
        mat4.perspective(this.m_MatP, Utils.radians(18.0), width / height, 0.1, 30.0);
    }


    onDrawFrame()
    {
        // effacer l'écran
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        // positionner la caméra
        mat4.identity(this.m_MatV);
        mat4.translate(this.m_MatV, this.m_MatV, vec3.fromValues(0, -0.5, -15));

        // rotation demandée par la souris
        mat4.rotateX(this.m_MatV, this.m_MatV, Utils.radians(20.0));
        mat4.rotateY(this.m_MatV, this.m_MatV, Utils.radians(-30.0));

        // dessiner la grille et le trièdre
        this.m_Grid.onDraw(this.m_MatP, this.m_MatV);
        this.m_Triedre.onDraw(this.m_MatP, this.m_MatV, 2.0);

        // dessiner l'avion en (0, +1, 0)
        mat4.translate(this.m_MatVM, this.m_MatV, vec3.fromValues(0, 1, 0));

        // angles d'Euler
        /// TODO rajouter les autres rotations et voir ce que ça donne
        mat4.rotateY(this.m_MatVM, this.m_MatVM, Utils.radians(-15.0));

        // dessiner un trièdre dans cette rotation
        this.m_Triedre.onDraw(this.m_MatP, this.m_MatVM, 4.0);

        // augmenter la taille de l'avion
        mat4.scale(this.m_MatVM, this.m_MatVM, vec3.fromValues(5.0, 5.0, 5.0));
        this.m_Avion.onDraw(this.m_MatP, this.m_MatVM);
    }


    /** supprime tous les objets de cette scène */
    destroy()
    {
        this.m_Grid.destroy();
        this.m_Avion.destroy();
    }
}

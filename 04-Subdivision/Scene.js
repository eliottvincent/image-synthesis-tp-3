// Définition de la classe Scene

// superclasses et classes nécessaires
Requires("Platon");

var colorRed   = vec3.fromValues(1.0, 0.0, 0.2);
var colorBlack = vec3.fromValues(0.0, 0.0, 0.0);


class Scene
{
    /** constructeur */
    constructor()
    {
        // créer les objets à dessiner
        this.m_Platon = new Platon();

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
        mat4.translate(this.m_MatV, this.m_MatV, vec3.fromValues(0, 0.0, -8));

        // rotation demandée par la souris
        mat4.rotateX(this.m_MatV, this.m_MatV, Utils.radians(0.0));
        mat4.rotateY(this.m_MatV, this.m_MatV, Utils.radians(0.0));

        // dessiner les triangles de la plaque légèrement en arrière
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        this.m_Platon.setColor(colorRed);
        this.m_Platon.onDraw(this.m_MatP, this.m_MatV);
        gl.disable(gl.POLYGON_OFFSET_FILL);

        // dessiner les arêtes des triangles en noir
        this.m_Platon.setColor(colorBlack);
        this.m_Platon.onDrawEdges(this.m_MatP, this.m_MatV);
    }


    /** supprime tous les objets de cette scène */
    destroy()
    {
        this.m_Platon.destroy();
    }
}

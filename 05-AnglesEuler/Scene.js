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

        // gestion souris
        this.m_Azimut = -30.0;
        this.m_Elevation = 20.0;
        this.m_Pivot = vec3.fromValues(0, 0, -15);
        this.m_Clicked = false;

        // matrices
        this.m_MatP = mat4.create();
        this.m_MatV = mat4.create();
        this.m_MatVM = mat4.create();
    }

    onMouseDown(btn, x, y)
    {
        this.m_Clicked = true;
        this.m_MousePrecX = x;
        this.m_MousePrecY = y;
    }

    onMouseUp(btn, x, y)
    {
        this.m_Clicked = false;
    }

    onMouseMove(x, y)
    {
        if (! this.m_Clicked) return;

        this.m_Azimut += 0.3 * (x - this.m_MousePrecX);
        this.m_Elevation += 0.3 * (y - this.m_MousePrecY);

        this.m_MousePrecX = x;
        this.m_MousePrecY = y;
    }

    onKeyDown(code)
    {
        switch (code) {
            case 'Z':
                this.m_Pivot[2] += 1;
                break;
            case 'S':
                this.m_Pivot[2] -= 1;
                break;
            case 'Q':
                this.m_Pivot[0] += 1;
                break;
            case 'D':
                this.m_Pivot[0] -= 1;
                break;

        }
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
        // mat4.translate(this.m_MatV, this.m_MatV, vec3.fromValues(0, -0.5, -15));
        mat4.translate(this.m_MatV, this.m_MatV, this.m_Pivot);

        // rotation demandée par la souris
        mat4.rotateX(this.m_MatV, this.m_MatV, Utils.radians(this.m_Elevation));
        mat4.rotateY(this.m_MatV, this.m_MatV, Utils.radians(this.m_Azimut));

        // dessiner la grille et le trièdre
        this.m_Grid.onDraw(this.m_MatP, this.m_MatV);
        this.m_Triedre.onDraw(this.m_MatP, this.m_MatV, 2.0);

        // dessiner l'avion en (0, +1, 0)
        mat4.translate(this.m_MatVM, this.m_MatV, vec3.fromValues(0, 1, 0));

        // angles d'Euler
        mat4.rotateY(this.m_MatVM, this.m_MatVM, Utils.radians(Utils.getTime() * 15));  // lacet
        mat4.rotateX(this.m_MatVM, this.m_MatVM, Utils.radians(Utils.getTime() * 30));  // tangage
        mat4.rotateZ(this.m_MatVM, this.m_MatVM, Utils.radians(Utils.getTime() * 45));    // roulis

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

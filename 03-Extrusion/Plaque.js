// Définition de la classe Plaque

Requires("Mesh");


class Plaque extends Mesh
{
    /** constructeur */
    constructor()
    {
        super("Plaque");

        /** maillage */

        // sommets
        let A = new Vertex(this, -2.0, 0.0,-2.0);
        let B = new Vertex(this,  2.0, 0.0,-2.0);
        let C = new Vertex(this, -2.0, 0.0, 2.0);
        let D = new Vertex(this,  2.0, 0.0, 2.0);
        let E = new Vertex(this,  0.0, 0.0,-1.0);
        let F = new Vertex(this, -1.0, 0.0, 0.0);
        let G = new Vertex(this,  1.0, 0.0, 0.0);
        let H = new Vertex(this,  0.0, 0.0, 1.0);

        // triangles
        new Triangle(this, A, E, B);
        new Triangle(this, B, E, G);
        new Triangle(this, B, G, D);
        new Triangle(this, D, G, H);
        new Triangle(this, D, H, C);
        new Triangle(this, C, H, F);
        new Triangle(this, C, F, A);
        new Triangle(this, A, F, E);
        // triangles du centre
        let T1 = new Triangle(this, E, F, H);
        let T2 = new Triangle(this, E, H, G);

        // calculer les normales
        this.computeNormals();

        // appliquer une extrusion sur T1 et T2
        this.extrude([T1, T2], vec3.fromValues( 0.2, 1.0, -0.1));
        this.extrude([T1, T2], vec3.fromValues(-0.2, 1.0, 0.1));

        // VBOs
        this.buildVBOs();
        this.buildEdgesVBO();

        /** shader */

        let srcVertexShader = dedent
            `#version 300 es
            uniform mat4 matPVM;
            in vec3 glVertex;
            void main()
            {
                gl_Position = matPVM * vec4(glVertex, 1.0);
            }`;

        let srcFragmentShader = dedent
            `#version 300 es
            precision mediump float;
            uniform vec3 color;
            out vec4 glFragColor;
            void main()
            {
                // pour la mise au point de la perspective (near et far)
                glFragColor = vec4(color, 1.0);
            }`;


        // compiler le shader de dessin
        this.m_ShaderId = Utils.makeShaderProgram(srcVertexShader, srcFragmentShader, this.m_Name);

        // déterminer où sont les variables attribute et uniform
        this.m_MatPVMLoc     = gl.getUniformLocation(this.m_ShaderId, "matPVM");
        this.m_ConstColorLoc = gl.getUniformLocation(this.m_ShaderId, "color");
        this.m_VertexLoc     = gl.getAttribLocation(this.m_ShaderId, "glVertex");
    }


    /**
     * change la couleur de dessin
     * @param color : fournir un vec3(r,g,b)
     */
    setColor(color)
    {
        gl.useProgram(this.m_ShaderId);
        vec3.glUniform(this.m_ConstColorLoc, color);
        gl.useProgram(null);
    }


    /**
     * supprime toutes les ressources allouées dans le constructeur
     */
    destroy()
    {
        super.destroy();

        // supprimer le shader
        Utils.deleteShaderProgram(this.m_ShaderId);
    }
}

// Définition de la classe Pyramide

Requires("Mesh");


class Pyramide extends Mesh
{
    /** constructeur */
    constructor()
    {
        super("Pyramide");

        /** maillage */

        // sommets
        let v0 = new Vertex(this,  0.0, 4.0,  0.0).setColor(0.2,  0.6,  0.2);
        let v1 = new Vertex(this,  1.0, 0.0,  0.0).setColor(0.1,  0.45, 0.15);
        let v2 = new Vertex(this,  0.0, 0.0, -1.0).setColor(0.15, 0.5,  0.1);
        let v3 = new Vertex(this, -1.0, 0.0,  0.0).setColor(0.1,  0.4,  0.15);
        let v4 = new Vertex(this,  0.0, 0.0,  1.0).setColor(0.15, 0.5,  0.1);

        // triangles
        new Triangle(this, v0, v1, v2);
        new Triangle(this, v0, v2, v3);
        new Triangle(this, v0, v3, v4);
        new Triangle(this, v0, v4, v1);
        new Triangle(this, v4, v3, v2);
        new Triangle(this, v2, v1, v4);

        // VBOs
        this.buildVBOs();

        /** shader */

        let srcVertexShader = dedent
            `#version 300 es
            uniform mat4 matPVM;
            in vec3 glVertex;
            in vec3 glColor;
            out vec3 frgColor;
            void main()
            {
                gl_Position = matPVM * vec4(glVertex, 1.0);
                frgColor = glColor;
            }`;

        let srcFragmentShader = dedent
            `#version 300 es
            precision mediump float;
            in vec3 frgColor;
            out vec4 glFragColor;
            void main()
            {
                // pour la mise au point de la perspective (near et far)
                glFragColor = vec4(frgColor, 1.0);
            }`;


        // compiler le shader de dessin
        this.m_ShaderId = Utils.makeShaderProgram(srcVertexShader, srcFragmentShader, this.m_Name);

        // déterminer où sont les variables attribute et uniform
        this.m_MatPVMLoc = gl.getUniformLocation(this.m_ShaderId, "matPVM");
        this.m_VertexLoc = gl.getAttribLocation(this.m_ShaderId, "glVertex");
        this.m_ColorLoc  = gl.getAttribLocation(this.m_ShaderId, "glColor");
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

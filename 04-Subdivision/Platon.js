// Définition de la classe Platon

Requires("Mesh");


class Platon extends Mesh
{
    /** constructeur */
    constructor()
    {
        super("Platon");

        /** maillage */


        // constantes
        const a = 0.525731112119133606;
        const b = 0.850650808352039932;
        const c = 0.577350269;
        const platonic_type = 2;

        // sommets
        let A,B,C,D,E,F,G,H,I,J,K,L;

        // coordonnées des sommets
        switch (platonic_type) {
            case 0:
                // tétraèdre
                A = new Vertex(this,  c, c, c);
                B = new Vertex(this, -c,-c, c);
                C = new Vertex(this,  c,-c,-c);
                D = new Vertex(this, -c, c,-c);

                // ajout des triangles de cette forme
                new Triangle(this, A,B,C);
                new Triangle(this, B,A,D);
                new Triangle(this, B,D,C);
                new Triangle(this, A,C,D);

                break;

            case 1:
                // octaèdre
                A = new Vertex(this,  0, 0,-1);
                B = new Vertex(this,  1, 0, 0);
                C = new Vertex(this,  0,-1, 0);
                D = new Vertex(this, -1, 0, 0);
                E = new Vertex(this,  0, 1, 0);
                F = new Vertex(this,  0, 0, 1);

                // ajout des triangles de cette forme
                new Triangle(this, A,B,C);
                new Triangle(this, A,C,D);
                new Triangle(this, A,D,E);
                new Triangle(this, A,E,B);
                new Triangle(this, F,C,B);
                new Triangle(this, F,D,C);
                new Triangle(this, F,E,D);
                new Triangle(this, F,B,E);

                break;

            case 2:
                // icosaèdre
                A = new Vertex(this,  a, 0,-b);
                B = new Vertex(this, -a, 0,-b);
                C = new Vertex(this,  a, 0, b);
                D = new Vertex(this, -a, 0, b);
                E = new Vertex(this,  0,-b,-a);
                F = new Vertex(this,  0,-b, a);
                G = new Vertex(this,  0, b,-a);
                H = new Vertex(this,  0, b, a);
                I = new Vertex(this, -b,-a, 0);
                J = new Vertex(this,  b,-a, 0);
                K = new Vertex(this, -b, a, 0);
                L = new Vertex(this,  b, a, 0);

                // ajout des triangles de cette forme
                new Triangle(this, A,E,B);
                new Triangle(this, A,J,E);
                new Triangle(this, J,F,E);
                new Triangle(this, E,F,I);
                new Triangle(this, E,I,B);
                new Triangle(this, I,K,B);
                new Triangle(this, I,D,K);
                new Triangle(this, F,D,I);
                new Triangle(this, F,C,D);
                new Triangle(this, C,H,D);
                new Triangle(this, H,K,D);
                new Triangle(this, H,G,K);
                new Triangle(this, H,L,G);
                new Triangle(this, L,A,G);
                new Triangle(this, A,B,G);
                new Triangle(this, G,B,K);
                new Triangle(this, J,A,L);
                new Triangle(this, J,L,C);
                new Triangle(this, J,C,F);
                new Triangle(this, H,C,L);

                break;
        }

        // subdiviser tous les triangles (décommenter les 1 à 4 lignes quand ça marchera)
        //this.subdivide(true);
        //this.subdivide(true);
        //this.subdivide(true);
        //this.subdivide(true);

        // calculer les normales (elles ne sont pas bonnes si les points milieu sont distincts)
        this.computeNormals();

        // VBOs
        this.buildVBOs();
        this.buildEdgesVBO();

        /** shader */

        let srcVertexShader = dedent
            `#version 300 es
            const vec3 L = vec3(0.5, 1.0, 1.0);
            uniform mat4 matPVM;
            uniform mat3 matN;
            in vec3 glVertex;
            in vec3 glNormal;
            out vec3 frgN;
            out vec3 frgL;
            void main()
            {
                gl_Position = matPVM * vec4(glVertex, 1.0);
                frgN = matN * glNormal;
                frgL = matN * L;
            }`;

        let srcFragmentShader = dedent
            `#version 300 es
            precision mediump float;
            in vec3 frgN;
            in vec3 frgL;
            uniform vec3 color;
            out vec4 glFragColor;
            void main()
            {
                vec3 N = normalize(frgN);
                vec3 L = normalize(frgL);
                float dotNL = clamp(dot(N, L), 0.0, 1.0);
                glFragColor = vec4(color, 1.0) * dotNL;
            }`;


        // compiler le shader de dessin
        this.m_ShaderId = Utils.makeShaderProgram(srcVertexShader, srcFragmentShader, this.m_Name);

        // déterminer où sont les variables attribute et uniform
        this.m_MatPVMLoc      = gl.getUniformLocation(this.m_ShaderId, "matPVM");
        this.m_MatNLoc        = gl.getUniformLocation(this.m_ShaderId, "matN");
        this.m_ConstColorLoc  = gl.getUniformLocation(this.m_ShaderId, "color");
        this.m_VertexLoc      = gl.getAttribLocation(this.m_ShaderId, "glVertex");
        this.m_NormalLoc      = gl.getAttribLocation(this.m_ShaderId, "glNormal");
        this.m_ColorLoc       = null; // VBO des couleurs pas utilisé
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

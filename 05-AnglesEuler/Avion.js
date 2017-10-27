// Définition de la classe Avion
// remarque: l'avion qui est proposé est extrêmement simplifié pour pouvoir être chargé assez rapidement

Requires("Mesh");


class Avion extends Mesh
{
    /** constructeur */
    constructor()
    {
        super("Avion");

        /** maillage */

        // lire le fichier obj
        this.loadObj("data/avion.obj", this.onAvionLoaded);


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
            out vec4 glFragColor;
            const vec3 Kd = vec3(0.7, 0.8, 0.9);
            void main()
            {
                vec3 N = normalize(frgN);
                vec3 L = normalize(frgL);
                float dotNL = clamp(dot(N, L), 0.0, 1.0);
                // 70% d'éclairement diffus et 30% d'éclairement ambiant
                glFragColor = vec4(Kd * 0.7, 0.0) * dotNL + vec4(Kd * 0.3, 1.0);
            }`;


        // compiler le shader de dessin
        this.m_ShaderId = Utils.makeShaderProgram(srcVertexShader, srcFragmentShader, this.m_Name);

        // déterminer où sont les variables attribute et uniform
        this.m_MatPVMLoc = gl.getUniformLocation(this.m_ShaderId, "matPVM");
        this.m_MatNLoc   = gl.getUniformLocation(this.m_ShaderId, "matN");
        this.m_VertexLoc = gl.getAttribLocation(this.m_ShaderId, "glVertex");
        this.m_NormalLoc = gl.getAttribLocation(this.m_ShaderId, "glNormal");
        this.m_ColorLoc  = null; // VBO des couleurs pas utilisé
    }


    /**
     * cette méthode est appelée quand le fichier OBJ est chargé
     */
    onAvionLoaded()
    {
        // calculer les normales du maillage
        this.computeNormals();

        // construire les VBO pour le shader
        this.buildVBOs();
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

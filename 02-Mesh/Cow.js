// Définition de la classe Cow

Requires("Mesh");


class Cow extends Mesh
{
    /** constructeur */
    constructor()
    {
        super("Cow");

        /** maillage */

        // lire le fichier obj
        this.loadObj("data/cow.obj", this.onCowLoaded);


        /** shader */

        let srcVertexShader = dedent
            `#version 100
            const vec3 L = vec3(0.5, 1.0, 1.0);
            uniform mat4 matPVM;
            uniform mat3 matN;
            attribute vec3 glVertex;
            attribute vec3 glNormal;
            varying vec3 frgN;
            varying vec3 frgL;
            void main()
            {
                gl_Position = matPVM * vec4(glVertex, 1.0);
                frgN = matN * glNormal;
                frgL = matN * L;
            }`;

        let srcFragmentShader = dedent
            `#version 100
            precision mediump float;
            varying vec3 frgN;
            varying vec3 frgL;
            void main()
            {
                vec3 N = normalize(frgN);
                vec3 L = normalize(frgL);
                float dotNL = clamp(dot(N, L), 0.0, 1.0);
                gl_FragColor = vec4(1.0, 0.7, 0.6, 1.0) * dotNL;
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
    onCowLoaded()
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

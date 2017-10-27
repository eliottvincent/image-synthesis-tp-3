// Définition de la classe Triedre
// trois lignes représentant les axes du repère


class Triedre
{
    /** constructeur */
    constructor()
    {
        /** shader */

        let srcVertexShader = dedent
            `#version 300 es
            uniform mat4 matrix;
            in vec3 glVertex;
            in vec3 glColor;
            out vec3 frgColor;
            void main()
            {
                gl_Position = matrix * vec4(glVertex, 1.0);
                frgColor = glColor;
            }`;

        let srcFragmentShader = dedent
            `#version 300 es
            precision mediump float;
            const float FogDistance = 12.0;
            const vec3 fog_color = vec3(0.9, 0.9, 0.9);
            in vec3 frgColor;
            out vec4 glFragColor;
            void main()
            {
                // distance entre l'écran et le fragment
                float dist = gl_FragCoord.z / gl_FragCoord.w;
                //glFragColor = vec4(dist - 9.0, 9.0 - dist, 0, 1);return;
                // taux de brouillard en fonction de la distance
                float fog = clamp((dist-FogDistance)/FogDistance, 0.0, 1.0);
                //glFragColor = vec4(fog, fog, fog, 1);return;
                // mélange couleur et brouillard
                glFragColor = vec4(mix(frgColor, fog_color, fog), 1.0);
            }`;

        // compiler le shader de dessin
        this.m_ShaderId = Utils.makeShaderProgram(srcVertexShader, srcFragmentShader, "Triedre");

        // déterminer où sont les variables attribute et uniform
        this.m_MatrixLoc = gl.getUniformLocation(this.m_ShaderId, "matrix");
        this.m_VertexLoc = gl.getAttribLocation(this.m_ShaderId, "glVertex");
        this.m_ColorLoc  = gl.getAttribLocation(this.m_ShaderId, "glColor");

        /** VBOs */

        // créer et remplir le buffer des coordonnées et des couleurs pour 3 lignes
        let vertices = [
            0.0, 0.0, 0.0,  1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,  0.0, 1.0, 0.0,
            0.0, 0.0, 0.0,  0.0, 0.0, 1.0,
        ];
        let colors = [
            1.0, 0.0, 0.0,  1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
        ];
        this.m_VertexBufferId = Utils.makeFloatVBO(vertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.m_ColorBufferId  = Utils.makeFloatVBO(colors,   gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.VERTICES_COUNT = vertices.length / 3;

        // matrice de transformation intermédiaire
        this.m_MatPVM = mat4.create();      // P * V * M
    }


    /**
     * dessiner l'objet
     * @param matP : matrice de projection perpective
     * @param matV : matrice de transformation de l'objet par rapport à la caméra
     * @param width : largeur des lignes du trièdre
     */
    onDraw(matP, matV, width=1.0)
    {
        // activer le shader
        gl.useProgram(this.m_ShaderId);

        // fournir la matrice P * V * M au shader
        mat4.mul(this.m_MatPVM, matP, matV);
        mat4.glUniformMatrix(this.m_MatrixLoc, this.m_MatPVM);

        // activer et lier le buffer contenant les coordonnées
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_VertexBufferId);
        gl.enableVertexAttribArray(this.m_VertexLoc);
        gl.vertexAttribPointer(this.m_VertexLoc, Utils.VEC3, gl.FLOAT, gl.FALSE, 0, 0);

        // activer et lier le buffer contenant les couleurs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.m_ColorBufferId);
        gl.enableVertexAttribArray(this.m_ColorLoc);
        gl.vertexAttribPointer(this.m_ColorLoc, Utils.VEC3, gl.FLOAT, gl.FALSE, 0, 0);

        // épaisseur des lignes
        gl.lineWidth(width);

        // dessiner les lignes
        gl.drawArrays(gl.LINES, 0, this.VERTICES_COUNT);

        // revenir à l'épaisseur précédente
        gl.lineWidth(1.0);

        // désactiver les buffers
        gl.disableVertexAttribArray(this.m_VertexLoc);
        gl.disableVertexAttribArray(this.m_ColorLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // désactiver le shader
        gl.useProgram(null);
    }


    /** destructeur */
    destroy()
    {
        // supprimer le shader et les VBOs
        Utils.deleteShaderProgram(this.m_ShaderId);
        Utils.deleteVBO(this.m_VertexBufferId);
        Utils.deleteVBO(this.m_ColorBufferId);
    }
}

// Définition de la classe Grid


class Grid
{
    /**
     * constructeur
     * @param nbX : il y aura des lignes de x = -nbX à +nbX
     * @param nbZ : il y aura des lignes de z = -nbZ à +nbZ
     */
    constructor(nbX=5, nbZ=5)
    {
        /** shader */

        let srcVertexShader = dedent
            `#version 100
            uniform mat4 matrix;
            attribute vec3 glVertex;
            void main()
            {
                gl_Position = matrix * vec4(glVertex, 1.0);
            }`;

        let srcFragmentShader = dedent
            `#version 100
            precision mediump float;
            void main()
            {
                gl_FragColor = vec4(0.7, 0.7, 0.7, 1.0);
            }`;

        // compiler le shader de dessin
        this.m_ShaderId = Utils.makeShaderProgram(srcVertexShader, srcFragmentShader, "Grid");

        // déterminer où sont les variables attribute et uniform
        this.m_MatrixLoc = gl.getUniformLocation(this.m_ShaderId, "matrix");
        this.m_VertexLoc = gl.getAttribLocation(this.m_ShaderId, "glVertex");

        /** VBOs */

        // créer et remplir le buffer des coordonnées
        let vertices = [];
        for (let x = -nbX; x <= +nbX; x += 1.0) {
            vertices.push(x); vertices.push(0.0); vertices.push(-nbZ);
            vertices.push(x); vertices.push(0.0); vertices.push(+nbZ);
        }
        for (let z = -nbZ; z <= +nbZ; z += 1.0) {
            vertices.push(-nbX); vertices.push(0.0); vertices.push(z);
            vertices.push(+nbX); vertices.push(0.0); vertices.push(z);
        }
        this.m_VertexBufferId = Utils.makeFloatVBO(vertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.VERTICES_COUNT = vertices.length / 3;

        // matrices de transformation intermédiaires (on pourrait économiser l'une d'elles)
        this.m_MatPVM = mat4.create();      // P * V * M
    }


    /**
     * dessiner l'objet
     * @param matP : matrice de projection perpective
     * @param matV : matrice de transformation de l'objet par rapport à la caméra
     */
    onDraw(matP, matV)
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

        // dessiner les lignes
        gl.drawArrays(gl.LINES, 0, this.VERTICES_COUNT);

        // désactiver les buffers
        gl.disableVertexAttribArray(this.m_VertexLoc);
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
    }
}

module.exports = function(grunt){

  grunt.initConfig({

    /**
     * Concatena todo css em apenas um arquivo.
     * Dentro de "assets/css/app.css" existem @includes para outros arquivos com diferentes localizações
     * Eles estão em ordem de precedecia correta
     */
    cssmin: {
      options : {
        // keepSpecialComments: 0,
        rebase : false,
      },
      target: {
        files: {
          'public/dist/css/app.min.css': ['public/assets/css/app.css']
        }
      }
    },


    /**
     * Otimiza o código alterando nomes de variáveis e minificando o código em 4 níveis:
     *
     * - Core :
     *   Seleciona app, controllers, diretivas e serviços da aplicação e transforma em um único arquivo
     *   atlas.js que contém o código minificado.
     *
     * - Helpers :
     *   Usa a pasta de helpers/utils e otimiza todo código.
     *
     * - Plugins :
     *   Busca todos os plugins jQuery, otimiza e coloca em produção.
     *
     * - Components :
     *   Busca todos components ReactJS, otimiza e coloca em produção.
     */
    uglify: {
      core: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/dist/sourcemap.map',
          mangle : false,
        },
        files: {
          'public/dist/js/atlas.js': [
            'public/assets/js/app.js',
            'public/assets/js/controller.js',
            'public/assets/js/directive.js',
            'public/assets/js/service.js'
          ]
        }
      },

      helpers: {
        options: {
          mangle : false,
        },
        files: [{
          expand: true,
          cwd: 'public/assets/js/helpers/',
          src: '**/*.js',
          dest: 'public/dist/js/helpers/'
        }]
      },

      plugins: {
        files: [{
          expand: true,
          cwd: 'public/assets/js/plugins/',
          dest: 'public/dist/js/plugins/',
          src : '{,*/}*.js'
        }]
      },

      components: {
        options: {
          mangle : false,
        },
        files: [{
          expand: true,
          cwd: 'public/assets/js/components/',
          src: '{,*/}*.js',
          dest: 'public/dist/js/components/'
        }]
      },
    },


    /**
     * Observa arquivos para manter a pasta de produção sempre atualizada
     *
     * - Scripts:
     *   Observa a pasta assets por arquivos javascript, qualquer arquivo alterado dispara
     *   uglify do core, helpers e components ( não há a necessidade de plugins )
     *
     * - Css:
     *   Observa a pasta assets por arquivos css e executa a minificação de todos
     *
     * - Images:
     *   Observa por qualquer edição de imagens em assets, otimiza-as e coloca na pasta de produção
     */
    watch: {
      scripts: {
        files: ['public/assets/**/*.js'],
        tasks: ['uglify:core', 'uglify:helpers', 'uglify:components'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: 'public/assets/**/*.css',
        tasks: ['cssmin'],
      },
      images : {
        files : ["public/assets/**/*.{png,jpg,gif}"],
        tasks : ['imagemin']
      }
    },

    /**
     * Copia todos os arquivos que não podem ser otimizados/minificados
     *
     * - Other:
     *   Arquivos de fontes, icones, txt, svg
     *
     * - Libs:
     *   Bibliotecas usadas no projeto, uma vez que já foram baixadas minificadas não há a necessidade
     *   de otimizá-las
     */
    copy: {
      other: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'public/assets/',
          dest: 'public/dist/',
          src: [
            '{,*/}*.{ico,txt,map}',
            '{,*/}*.{webp,gif,svg}',
            'fonts/*.*'
          ]
        }]
      },

      libs: {
        files: [{
          expand: true,
          cwd: 'public/assets/js/libs/',
          dest: 'public/dist/js/libs/',
          src : '{,*/}*.*'
        }]
      }

    },

    /**
     * Tarefa para limpar a pasta de produção
     * Exclui todos os arquivos dentro da pasta 'dist'
     */
    clean: {
      dist: {
        files: {src: ['public/dist/**/*']}
      },
    },

    /**
     * Otimiza imagens png, jpg, gif
     */
    imagemin: {
      prod: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'public/assets',
          src: ['{,*/}*.{png,jpg,gif}'],
          dest: 'public/dist'
        }]
      },
    },

  });


  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  /**
   * Registra a tarefa de build do sistema com as seguintes tasks:
   *   - Limpa pasta de dist
   *   - minifica todo css
   *   - minifica/uglify de todo js
   *   - minifica imagens
   *   - copia demais arquivos
   */
  grunt.registerTask('build', ['clean', 'cssmin', 'uglify', 'imagemin', 'copy']);

  // Registra task default para "watch"
  grunt.registerTask('default', ['watch']);

}
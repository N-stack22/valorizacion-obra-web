# Informe completo del proyecto

Fuente: `C:\Users\Usuario\Downloads\Informe_Completo_Sistema_Valorizacion_Obra_IA_Instrumentos.docx`.

Este Markdown fue generado desde el Word completo para conservar el contenido del informe del proyecto dentro del repositorio.

UNIVERSIDAD CONTINENTALFACULTAD DE INGENIERÍAESCUELA ACADÉMICO PROFESIONAL DE INGENIERÍA DE SISTEMAS E INFORMÁTICA


<!-- Tabla extraida 1 -->
| INFORME TÉCNICO FINALImplementación de un Sistema web con enfoque BPM y apoyo de inteligencia artificial para la elaboración del informe mensual de valorización de obra |
| --- |

PRESENTADO POR:Rodriguez Rios Nathalie TatianaEufracio Abal Leonardo PaoloGamarra Huaranga Grace MalúASESOR:DR. MAGLIONI ARANA CAPARACHINHUANCAYO - PERÚ2026

CONTENIDO GENERAL

PORTADA

CONTENIDO GENERAL

CAPÍTULO 1 INFORMACIÓN GENERAL DEL PROYECTO

CAPÍTULO 2 CONTEXTO ORGANIZACIONAL Y ANÁLISIS DEL PROBLEMA

CAPÍTULO 3 ANÁLISIS DE PROCESOS DE NEGOCIO

CAPÍTULO 4 ANÁLISIS DE REQUERIMIENTOS DEL SISTEMA

CAPÍTULO 5 PLANIFICACIÓN DEL PROYECTO Y PLAN DE CALIDAD

5.7. Instrumentos de evaluación, recolección de datos y validación del sistema

CAPÍTULO 6 DISEÑO DEL SISTEMA

CAPÍTULO 7 ARQUITECTURA TECNOLÓGICA DEL SISTEMA

CAPÍTULO 8 DESARROLLO DEL SISTEMA

CAPÍTULO 9 CONTROL DE VERSIONES Y GESTIÓN DEL REPOSITORIO

CAPÍTULO 10 DOCKERIZACIÓN Y DESPLIEGUE DE MÓDULOS

CAPÍTULO 11 ESTRATEGIA DE PRUEBAS DE SOFTWARE

CAPÍTULO 12 AUTOMATIZACIÓN DE PRUEBAS

CAPÍTULO 13 MÉTRICAS DE CALIDAD

CAPÍTULO 14 IMPLEMENTACIÓN Y MONITOREO

## CONCLUSIONES

## RECOMENDACIONES

## REFERENCIAS

## ANEXOS

Anexos 6 al 15. Instrumentos, matrices, fichas y listas de cotejo de validación

Nota: el índice mantiene la estructura del informe base. En Word puede actualizarse con referencias automáticas de página durante la edición final.

CAPÍTULO 1

INFORMACIÓN GENERAL DEL PROYECTO

## 1.1. Resumen Ejecutivo

El presente proyecto tiene como finalidad desarrollar e implementar un sistema web con enfoque BPM y apoyo de inteligencia artificial para la elaboración del informe mensual de valorización de obra pública. La propuesta responde a una necesidad real: transformar un proceso actualmente fragmentado, dependiente de hojas de cálculo, documentos de texto, archivos PDF, fotografías dispersas y validaciones manuales, en un flujo digital controlado, auditable, seguro y alineado con buenas prácticas de ingeniería de software [28].

La valorización mensual de obra es un proceso técnico, económico y documental crítico, porque determina el avance ejecutado, calcula el monto valorizado del periodo, sustenta metrados, integra evidencias de campo, controla reajustes, amortizaciones, plazos, cartas fianzas, ensayos de calidad y soporta el trámite de pago ante la entidad contratante. Los dos modelos documentales revisados muestran que un expediente mensual serio suele incluir ficha técnica, estado situacional, estado físico-financiero, avance programado frente a ejecutado, respaldo de metrados, plazos, responsables, modificaciones, ocurrencias, panel fotográfico, ensayos, conclusiones y recomendaciones [29], [30].

La solución propuesta no debe limitarse a “generar un PDF”. Debe sostener un proceso completo: parametrización contractual, carga de presupuesto base, apertura de periodos de valorización, registro de metrados, asociación de evidencias, validación contra saldo contractual, revisión del supervisor, observación y levantamiento de observaciones, cálculo de valorización, reajustes y amortizaciones, generación asistida de documentos mediante Claude, firma electrónica interna, auditoría y consulta por parte de la entidad pública. Para contratos de obra pública, el sistema debe considerar el marco normativo peruano vigente y de transición, incluyendo Ley N.° 32069, su Reglamento, directivas de valorizaciones en SEACE, normativa de datos personales, gobierno digital y firmas electrónicas [1]-[8].

Desde el punto de vista tecnológico, se propone desplegar el frontend como sitio estático en GitHub Pages, siempre que el sistema se compile como aplicación SPA y no requiera lógica de servidor en el navegador. El backend se desplegará en Railway como API/BFF responsable de autenticación complementaria, reglas de negocio, integración con base de datos, generación documental y consumo de Claude API. Cloudflare actuará como capa de DNS, TLS, CDN, WAF, reglas de rate limiting, protección de endpoints críticos y, opcionalmente, Turnstile o Workers para validaciones en el borde [16]-[18].

La calidad del proyecto se fundamenta en ISO/IEC 25010 para calidad del producto software, ISO/IEC/IEEE 29119 para pruebas, ISO 9001 para gestión de calidad, ISO/IEC 27001 para seguridad de la información, ISO/IEC 42001 para gobierno de inteligencia artificial, NIST SSDF para desarrollo seguro y OWASP Top 10 para riesgos web [9]-[15]. Esta combinación permite construir un informe técnicamente defendible, no solo académico, sino aplicable a un MVP serio con criterios de aceptación medibles.

La inteligencia artificial, representada por Claude, se integrará como motor de apoyo para redactar secciones narrativas del informe: memoria descriptiva, sustento técnico, análisis de avance, conclusiones y recomendaciones. Sin embargo, la IA no aprobará metrados, no reemplazará la revisión profesional y no tomará decisiones contractuales. Todo contenido generado se tratará como borrador revisable por el Residente y validable por el Supervisor. Esta restricción es coherente con las buenas prácticas de gobierno de IA y con la necesidad de prevenir errores, filtración de datos o contenido no sustentado [13], [19], [20].

## 1.2. Introducción

En la ejecución de obras públicas, la elaboración del informe mensual de valorización exige integrar información proveniente de diversas fuentes: expediente técnico, presupuesto contractual, análisis de costos unitarios, metrados ejecutados, cronograma valorizado, Curva S, cuaderno de obra, fotografías de campo, ensayos de calidad, observaciones del supervisor, adicionales, deductivos, ampliaciones, suspensiones, adelantos, amortizaciones y reajustes. Cuando estos datos se gestionan en herramientas separadas, el proceso se vuelve propenso a errores y difícil de auditar.

El informe base ya identifica que el proceso actual depende de herramientas no integradas, generando riesgos de duplicidad, errores de cálculo, pérdida de trazabilidad y retrasos en la revisión del supervisor [28]. En un entorno de obra pública, esos riesgos no son menores: pueden derivar en observaciones al expediente, retrabajo, demora en pagos, discrepancias entre residente y supervisión, y dificultad para sustentar decisiones ante la entidad.

El enfoque BPM permite analizar el flujo real del negocio, identificar actividades manuales, puntos de control, responsables, entradas, salidas, reglas y estados del proceso. Sobre ese flujo, el sistema web permitirá convertir cada etapa en una transacción trazable. En lugar de enviar archivos por correo o copiar datos entre Excel y Word, el usuario trabajará sobre una línea base contractual, registrará avances por partida, adjuntará evidencias, enviará a revisión, responderá observaciones y generará el expediente final con datos aprobados.

La propuesta incorpora además un enfoque de DevSecOps. El repositorio de referencia del ecommerce proporcionado por el equipo demuestra que ya existe una base técnica aprovechable: pruebas unitarias con Vitest, pruebas E2E con Playwright, flujos CI/CD, análisis con Sonar, controles de seguridad y documentación de pruebas manuales [31]. No obstante, para este proyecto deben añadirse pruebas especializadas de dominio: fórmula polinómica, factor K, valorización por partida, amortizaciones, carga de presupuesto, evidencias de obra, roles de residente/supervisor/entidad y generación documental con IA.

CAPÍTULO 2

CONTEXTO ORGANIZACIONAL Y ANÁLISIS DEL PROBLEMA

## 2.1. Contexto de la Organización

El proyecto se desarrolla en el contexto de una organización constructora o consultora vinculada a la ejecución, supervisión y control de proyectos de ingeniería civil. Para efectos del presente informe, se conserva el contexto planteado en el documento base de JJ&PP Ingenieros, orientado a obras públicas y a la elaboración de informes mensuales de valorización [28].

En este tipo de proyectos intervienen actores con responsabilidades diferenciadas: el Residente de Obra registra metrados y sustenta el avance; el Supervisor o Inspector revisa, observa o aprueba; la Entidad Pública monitorea el avance y recibe el expediente; el Representante Legal revisa la aprobación administrativa; y el Administrador del Sistema configura usuarios, proyectos, parámetros e índices. La solución debe respetar estos roles, porque la trazabilidad del expediente depende de saber quién registró, quién revisó, quién observó, quién aprobó y qué versión fue exportada.

### 2.1.1. Marco legal peruano aplicable

El sistema debe diseñarse considerando que el marco de contratación pública peruano se encuentra en un periodo de modernización normativa. Para nuevas contrataciones públicas corresponde considerar la Ley N.° 32069, Ley General de Contrataciones Públicas, y su Reglamento aprobado por Decreto Supremo N.° 009-2025-EF, sin dejar de contemplar obras que aún puedan estar sujetas al régimen anterior de la Ley N.° 30225 y sus directivas de transición [1], [2].

En materia de valorizaciones, la Directiva N.° 018-2025-OECE/CD regula el registro de valorizaciones de obra a través del SEACE bajo el nuevo marco institucional, mientras que la Directiva N.° 001-2022-OSCE/CD fue una referencia clave para la gestión electrónica de valorizaciones bajo el régimen anterior. Por ello, el sistema no debe afirmar integración oficial con SEACE en el MVP, pero sí debe generar información estructurada, trazable y compatible con un posterior registro o carga formal [3], [4].

El Cuaderno de Obra Digital debe considerarse como fuente documental de hechos relevantes, consultas, órdenes, ocurrencias y validaciones de obra. Aunque la directiva OSCE de 2020 fue derogada por el nuevo marco, su lógica funcional sigue siendo útil para definir trazabilidad, identificación de actores y conservación del historial de obra [5].

Por tratar datos personales de usuarios, firmas, correos, evidencias georreferenciadas y documentos contractuales, el sistema debe aplicar principios de protección de datos personales, minimización, finalidad, seguridad y acceso autorizado. Además, al operar como plataforma digital, debe considerar lineamientos de gobierno digital, interoperabilidad, identidad digital, seguridad digital y preservación de evidencia electrónica [6], [7].

El MVP puede implementar firma electrónica interna con hash, marca temporal, usuario autenticado y registro de auditoría. Sin embargo, no debe presentarse como firma digital certificada oficial ni reemplazar sistemas como ReFirma o certificados IOFE, salvo que en una etapa posterior se realice una integración formal conforme a la Ley de Firmas y Certificados Digitales [8].

### 2.1.2. Estructura documental esperada del informe mensual

Los documentos de valorización mensual revisados permiten identificar una estructura común para obras públicas peruanas. El informe de supervisión de la obra Los Geranios incluye aspectos generales, estado situacional, estado físico-financiero, cartas fianzas, avance físico y financiero programado frente a ejecutado, gráficos, respaldo de metrados, plazos, responsables, modificaciones, ocurrencias, panel fotográfico, métodos constructivos, ensayos y conclusiones [29]. El informe de avance de obra de Chiclayo incluye ficha técnica, ubicación, base legal, control administrativo, incidencias, metrados, valorización, Curva S, calendario valorizado, copias de cuaderno de obra, panel fotográfico y documentos de gestión [30].

Cuadro 1. Estructura documental mínima del expediente mensual de valorización


<!-- Tabla extraida 2 -->
| Sección documental | Información que debe generar o consolidar el sistema | Actor responsable |
| --- | --- | --- |
| Ficha técnica de obra | Nombre de obra, CUI, contrato, entidad, contratista, modalidad, sistema de contratación, plazo, ubicación, residente, supervisor, monto contractual. | Administrador / Residente |
| Estado físico-financiero | Avance programado del mes, avance ejecutado, avance acumulado, saldo por ejecutar, atraso o adelanto. | Sistema / Supervisor |
| Metrados y valorización | Partidas, unidad, metrado contractual, anterior, del mes, acumulado, saldo, precio unitario y parcial valorizado. | Residente / Sistema |
| Reajustes y amortizaciones | Fórmula polinómica, índices, factor K, reajuste, adelanto directo, adelanto de materiales y monto neto. | Sistema / Supervisor |
| Sustento técnico | Memoria descriptiva, trabajos ejecutados, incidencias, métodos constructivos y restricciones. | Residente / Claude asistido |
| Evidencias | Fotografías, coordenadas, fecha, partida asociada, ensayos de calidad y documentos técnicos. | Residente / Supervisor |
| Conclusiones y recomendaciones | Evaluación del periodo, alertas, acciones correctivas y cierre del informe. | Claude asistido / Residente / Supervisor |
| Firmas y auditoría | Firmas electrónicas internas, hash documental, fecha, usuario, versión exportada y registro de aprobación. | Residente / Supervisor / Representante Legal |

## 2.2. Identificación del Problema

El problema central es la ausencia de una plataforma integrada que controle de extremo a extremo la elaboración del informe mensual de valorización de obra pública. El proceso actual cumple la finalidad documental, pero depende de archivos aislados, validaciones manuales, copia de datos entre herramientas, revisión informal y almacenamiento disperso de evidencias.

Cuadro 2. Causas y consecuencias del problema


<!-- Tabla extraida 3 -->
| Causa | Efecto operativo | Riesgo para el expediente |
| --- | --- | --- |
| Uso de Excel, Word, PDF y carpetas sin integración | Duplicidad de datos y versiones no controladas. | Presentar montos o metrados inconsistentes. |
| Cálculos manuales de metrados y valorizaciones | Errores en fórmulas, celdas modificadas y falta de validaciones. | Observaciones, retrabajo o rechazo parcial. |
| Evidencias no asociadas a partidas | Fotografías y ensayos quedan fuera del flujo de revisión. | Dificultad para sustentar el avance ejecutado. |
| Revisión del supervisor fuera del sistema | Observaciones por correo, reuniones o anotaciones no estructuradas. | Pérdida de historial técnico de decisiones. |
| Redacción manual del informe | Demora en memoria, conclusiones, recomendaciones e índice. | Baja uniformidad documental y mayor carga operativa. |
| Ausencia de auditoría | No queda claro quién modificó o aprobó información. | Debilidad probatoria ante discrepancias. |
| Integración de IA sin control | Riesgo de alucinaciones, uso de datos sensibles o textos no sustentados. | Informe técnicamente incorrecto o con exposición de información. |

## 2.3. Problema general y problemas específicos

Problema general: ¿De qué manera la implementación de un sistema web con enfoque BPM y apoyo de inteligencia artificial permitirá optimizar la elaboración del informe mensual de valorización de obra pública?

¿Cómo la digitalización de la línea base contractual reducirá inconsistencias en presupuesto, partidas, cronograma e índices?

¿Cómo el registro estructurado de metrados ejecutados reducirá errores y excedentes frente al saldo contractual?

¿Cómo la vinculación de evidencias, fotografías y ensayos mejorará el sustento técnico del avance?

¿Cómo el workflow de revisión, observación, recorte, aprobación y cierre fortalecerá la fiscalización del supervisor?

¿Cómo la automatización de reajustes, amortizaciones y saldos aumentará la confiabilidad económica?

¿Cómo Claude apoyará la redacción técnica sin reemplazar la revisión profesional?

¿Cómo la auditoría, firmas electrónicas internas y versiones exportadas mejorarán la trazabilidad del expediente?

¿Cómo el despliegue en GitHub Pages, Railway y Cloudflare permitirá operar el MVP con seguridad, disponibilidad y control de costos?

CAPÍTULO 3

ANÁLISIS DE PROCESOS DE NEGOCIO

## 3.1. Descripción del Proceso Actual

El proceso actual inicia con la revisión del presupuesto contractual, que contiene partidas, metrados, precios unitarios, parciales y estructura económica. La información suele encontrarse en Excel, PDF o exportaciones de software especializado, por lo que el residente debe ordenar la información antes de registrar el avance mensual.

Luego, el residente recopila metrados ejecutados en campo, fotografías, ensayos, anotaciones de cuaderno de obra e incidencias. Posteriormente calcula metrados, elabora la valorización, copia resultados a documentos de texto, organiza cuadros, inserta fotografías y redacta la memoria. La supervisión revisa y observa fuera de un flujo único, lo que dificulta mantener evidencia de cada cambio.

Finalmente, cuando el expediente se aprueba, se firma y se presenta ante la entidad. El mayor problema no es la inexistencia de documentos, sino la falta de integración, control de cambios, seguridad por roles y trazabilidad entre dato, evidencia, cálculo, observación y versión final.

## 3.2. Modelado del Proceso Actual (AS-IS)

Cuadro 3. Modelo AS-IS resumido


<!-- Tabla extraida 4 -->
| Actividad AS-IS | Responsable | Herramienta típica | Problema detectado |
| --- | --- | --- | --- |
| Revisar presupuesto contractual | Residente | Excel/PDF/S10 | Riesgo de versión desactualizada. |
| Registrar avance de campo | Residente | Libreta/Excel/Fotos | Datos dispersos y sin validación. |
| Calcular metrados | Residente | Excel | Errores de fórmula y edición accidental. |
| Elaborar valorización mensual | Residente | Excel | Montos no integrados al expediente. |
| Redactar informe mensual | Residente | Word | Copiado manual y retrabajo. |
| Revisar y observar | Supervisor | PDF/correo/reuniones | Observaciones no estructuradas. |
| Firmar y presentar | Residente/Supervisor | Documento final | Firma no vinculada a hash/versionado. |


<!-- Tabla extraida 5 -->
| Figura 1. Diagrama BPMN AS-ISEspacio reservado para el diagrama del proceso actual. Debe mostrar carriles de Residente, Supervisor, Representante Legal y Entidad Pública. |
| --- |

## 3.3. Problemas del Proceso Actual

Los problemas se concentran en cinco puntos críticos: integridad del dato, exactitud de cálculos, trazabilidad de revisión, evidencia documental y generación del informe. Un sistema serio debe convertir cada punto crítico en una regla verificable: validaciones de metrado, estados de workflow, bitácora de cambios, control de permisos, evidencias vinculadas y reportes reproducibles.

## 3.4. Modelado del Proceso Propuesto (TO-BE)

El proceso TO-BE centraliza el flujo en una aplicación web. El Administrador crea el proyecto y carga la línea base; el Residente abre un periodo, registra metrados y evidencias; el sistema valida saldos y calcula valorización; el Supervisor revisa, observa, recorta o aprueba; el sistema calcula reajustes y amortizaciones; Claude genera borradores narrativos con datos aprobados; el usuario revisa y edita; finalmente se exporta el expediente con versión, hash y auditoría.

Cuadro 4. Modelo TO-BE resumido


<!-- Tabla extraida 6 -->
| Etapa TO-BE | Entrada | Control del sistema | Salida |
| --- | --- | --- | --- |
| Parametrización contractual | Contrato, presupuesto, ACU, cronograma, índices base. | Validación de estructura, obligatoriedad y duplicados. | Línea base habilitada. |
| Apertura de periodo | Mes, número de valorización, fechas. | Estado inicial y bloqueo de periodos cerrados. | Periodo abierto. |
| Registro de metrados | Metrados y fórmulas dimensionales. | Cálculo automático y validación contra saldo. | Planilla del mes. |
| Evidencias | Fotos, ensayos, documentos. | Vinculación obligatoria a partida/periodo. | Sustento técnico estructurado. |
| Fiscalización | Metrados y evidencias enviados. | Workflow de observación, corrección, aprobación y cierre. | Partidas aprobadas/observadas. |
| Cálculo económico | Metrados aprobados, precios, índices. | Valorización, factor K, reajustes y amortizaciones. | Resumen físico-financiero. |
| Generación con IA | Datos aprobados y contexto técnico. | Prompt versionado, minimización de datos, revisión humana. | Texto preliminar editable. |
| Exportación y firma | Informe compilado. | Hash, versión, firma interna y auditoría. | PDF/Word final trazable. |


<!-- Tabla extraida 7 -->
| Figura 2. Diagrama BPMN TO-BEEspacio reservado para el diagrama propuesto con estados: abierto, en revisión, observado, corregido, aprobado, cerrado y exportado. |
| --- |

## 3.5. Reglas BPM críticas

No se puede enviar a revisión un periodo sin metrados o sin evidencias mínimas en partidas con avance.

No se puede aprobar una partida si el metrado acumulado excede el saldo contractual salvo modificación aprobada.

No se puede generar el informe final si existen partidas observadas sin levantar.

No se puede ejecutar generación con Claude si el periodo no cuenta con datos suficientes y validados.

No se puede modificar una valorización cerrada sin abrir un proceso formal de rectificación o nueva versión.

La Entidad Pública debe tener acceso de solo lectura a expedientes aprobados y no a borradores internos.

CAPÍTULO 4

ANÁLISIS DE REQUERIMIENTOS DEL SISTEMA

## 4.1. Identificación de Actores del Sistema

Cuadro 5. Actores del sistema


<!-- Tabla extraida 8 -->
| Actor | Responsabilidad | Permisos principales |
| --- | --- | --- |
| Administrador del Sistema | Configura plataforma, usuarios, roles, empresas, obras, parámetros e índices. | CRUD maestro, asignación de roles, revisión de auditoría, mantenimiento. |
| Residente de Obra | Registra avances, metrados, evidencias y genera la valorización preliminar. | Registrar, editar en periodo abierto, enviar a revisión, revisar textos IA, firmar. |
| Supervisor o Inspector | Fiscaliza metrados, evidencias, valorización y expediente. | Observar, recortar, aprobar, cerrar periodo y firmar. |
| Entidad Pública / Monitor | Consulta estado de avance y descarga expedientes aprobados. | Solo lectura, descarga de documentos aprobados, consulta de trazabilidad visible. |
| Representante Legal | Revisa aprobación gerencial y autoriza presentación administrativa. | Revisión, firma interna y consulta de expediente final. |
| Servicio Claude | Genera borradores narrativos a partir de datos estructurados autorizados. | No accede directamente a base de datos; recibe payload minimizado desde backend. |
| Sistema de Auditoría | Registra eventos, versiones, accesos, firmas y exportaciones. | Registro inmutable lógico, consulta por administradores autorizados. |

## 4.2. Requerimientos Funcionales

Cuadro 6. Requerimientos funcionales consolidados


<!-- Tabla extraida 9 -->
| Código | Requerimiento funcional | Prioridad |
| --- | --- | --- |
| RF-01 | Gestionar usuarios, roles y permisos con estados activo, suspendido y bloqueado. | Alta |
| RF-02 | Registrar empresas, consorcios, entidades públicas y representantes. | Alta |
| RF-03 | Crear proyectos de obra con CUI, contrato, ubicación, entidad, contratista, monto, plazo y modalidad. | Alta |
| RF-04 | Cargar presupuesto base desde Excel/CSV validando columnas, unidades, metrados, precios y totales. | Alta |
| RF-05 | Registrar partidas, subpartidas, ACU, precios unitarios, metrados contractuales y saldos. | Alta |
| RF-06 | Registrar cronograma valorizado base y construir Curva S programada. | Alta |
| RF-07 | Registrar adelanto directo, adelanto de materiales, cartas fianzas, vigencias y amortización planificada. | Alta |
| RF-08 | Administrar índices unificados, fecha base, fórmula polinómica y coeficientes. | Alta |
| RF-09 | Aperturar periodo mensual de valorización con número, mes, año, fecha inicial/final y estado. | Alta |
| RF-10 | Registrar metrados ejecutados por partida, frente, sector y periodo. | Alta |
| RF-11 | Registrar sustento dimensional: largo, ancho, alto, veces, parcial, total y observación técnica. | Alta |
| RF-12 | Calcular metrado anterior, del mes, acumulado y saldo por ejecutar. | Alta |
| RF-13 | Bloquear excedentes sobre metrado contractual salvo adicional/deductivo aprobado. | Alta |
| RF-14 | Adjuntar fotografías a partidas, incluyendo fecha, descripción, autor y coordenadas si existen. | Alta |
| RF-15 | Adjuntar ensayos, certificados, protocolos y documentos técnicos a partidas. | Media |
| RF-16 | Generar planilla de metrados del periodo con filtros por partida, frente y estado. | Alta |
| RF-17 | Enviar valorización a revisión del Supervisor. | Alta |
| RF-18 | Permitir al Supervisor observar partidas indicando motivo, cantidad observada y sustento. | Alta |
| RF-19 | Permitir recorte de metrado sustentado por el Supervisor con trazabilidad. | Alta |
| RF-20 | Permitir al Residente levantar observaciones y reenviar a revisión. | Alta |
| RF-21 | Aprobar partidas y cerrar conciliación técnica del periodo. | Alta |
| RF-22 | Calcular valorización contractual por partida con precio unitario. | Alta |
| RF-23 | Calcular avance físico-financiero del mes y acumulado. | Alta |
| RF-24 | Calcular factor K con fórmula polinómica e índices del periodo. | Alta |
| RF-25 | Calcular reajustes, amortización de adelantos, deducciones e IGV referencial. | Alta |
| RF-26 | Generar resumen de valorización mensual: anterior, actual, acumulado y saldo. | Alta |
| RF-27 | Generar cuadro programado vs ejecutado y atraso/adelanto. | Alta |
| RF-28 | Generar panel fotográfico ordenado por partida y periodo. | Media |
| RF-29 | Generar borrador de memoria descriptiva con Claude usando solo datos aprobados. | Alta |
| RF-30 | Generar sustento técnico narrativo, conclusiones y recomendaciones preliminares. | Alta |
| RF-31 | Permitir revisión, edición y aprobación humana de textos generados por IA. | Alta |
| RF-32 | Compilar expediente mensual en Word y PDF con índice, cuadros, anexos y firmas. | Alta |
| RF-33 | Registrar documento exportado con versión, hash, fecha, usuario y periodo. | Alta |
| RF-34 | Registrar firma electrónica interna del Residente, Supervisor y Representante Legal. | Alta |
| RF-35 | Consultar historial de valorizaciones aprobadas y acumulados para pre-liquidación. | Alta |
| RF-36 | Registrar adicionales, deductivos, ampliaciones, suspensiones y resoluciones. | Alta |
| RF-37 | Exportar reportes de auditoría, trazabilidad y matriz de cambios. | Media |
| RF-38 | Permitir consulta de expediente aprobado por Entidad Pública con acceso de solo lectura. | Alta |
| RF-39 | Generar alertas de cartas fianzas próximas a vencer y periodos pendientes. | Media |
| RF-40 | Registrar bitácora de errores, observaciones de calidad y acciones correctivas. | Media |

## 4.3. Requerimientos no Funcionales

Cuadro 7. Requerimientos no funcionales


<!-- Tabla extraida 10 -->
| Código | Característica | Criterio verificable | Prioridad |
| --- | --- | --- | --- |
| RNF-01 | Usabilidad | Interfaz responsiva, clara y validaciones visibles para usuarios técnicos de obra. | Alta |
| RNF-02 | Rendimiento | Operaciones frecuentes menores a 3 segundos bajo carga esperada; exportaciones largas con progreso. | Alta |
| RNF-03 | Confiabilidad | Cálculos críticos con pruebas unitarias, golden data y tolerancia decimal definida. | Alta |
| RNF-04 | Seguridad | Autenticación, autorización por roles, principio de mínimo privilegio y protección de archivos. | Alta |
| RNF-05 | Privacidad | Minimización de datos personales y control de geolocalización/fotografías. | Alta |
| RNF-06 | Mantenibilidad | Arquitectura modular por dominios y TypeScript estricto. | Alta |
| RNF-07 | Portabilidad | Frontend estático desplegable en GitHub Pages; backend dockerizable en Railway. | Alta |
| RNF-08 | Compatibilidad | Soporte para navegadores modernos y dispositivos de escritorio/tablet. | Media |
| RNF-09 | Auditabilidad | 100% de acciones críticas registradas con usuario, fecha, entidad afectada y valores relevantes. | Alta |
| RNF-10 | Calidad de código | Quality Gate en Sonar sin vulnerabilidades críticas ni bugs bloqueantes en código nuevo. | Alta |
| RNF-11 | Pruebas | Cobertura mínima definida para lógica crítica: cálculos, permisos, generación documental e IA. | Alta |
| RNF-12 | IA responsable | Claude genera borradores; el usuario decide, edita y aprueba. Prompts y respuestas versionadas. | Alta |
| RNF-13 | Disponibilidad | MVP con despliegues reproducibles, health checks y plan de respaldo. | Media |
| RNF-14 | Observabilidad | Logs estructurados, métricas de error, trazas de exportación y monitoreo básico. | Media |
| RNF-15 | Interoperabilidad futura | Diseño preparado para integración posterior con SEACE, ReFirma, S10 o ERP, fuera del MVP. | Media |

## 4.4. Casos de Uso del Sistema

Cuadro 8. Casos de uso principales


<!-- Tabla extraida 11 -->
| Código | Caso de uso | Actor principal | Resultado |
| --- | --- | --- | --- |
| CU-01 | Administrar usuarios y roles | Administrador | Usuarios y permisos configurados. |
| CU-02 | Crear proyecto de obra | Administrador/Residente | Proyecto disponible para línea base. |
| CU-03 | Importar presupuesto base | Residente | Partidas validadas y registradas. |
| CU-04 | Configurar fórmula polinómica | Administrador/Residente | Coeficientes e índices asociados. |
| CU-05 | Abrir periodo de valorización | Residente | Periodo en estado abierto. |
| CU-06 | Registrar metrados y sustentos | Residente | Metrados calculados y guardados. |
| CU-07 | Adjuntar evidencias | Residente | Fotos/ensayos vinculados a partidas. |
| CU-08 | Enviar a revisión | Residente | Periodo en estado en revisión. |
| CU-09 | Observar o recortar metrados | Supervisor | Observaciones trazables. |
| CU-10 | Levantar observaciones | Residente | Corrección reenviada. |
| CU-11 | Aprobar valorización | Supervisor | Periodo aprobado técnicamente. |
| CU-12 | Calcular reajustes y amortizaciones | Sistema | Resumen económico completo. |
| CU-13 | Generar borrador con Claude | Residente | Texto preliminar editable. |
| CU-14 | Exportar expediente | Residente/Supervisor | Word/PDF versionado. |
| CU-15 | Firmar electrónicamente | Residente/Supervisor/Legal | Firma interna registrada. |
| CU-16 | Consultar expediente aprobado | Entidad | Descarga de solo lectura. |
| CU-17 | Consolidar pre-liquidación | Residente/Supervisor | Historial acumulado de valorizaciones. |

## 4.5. Alcance funcional del MVP

El MVP incluye el flujo completo desde la carga de línea base hasta la generación del expediente mensual aprobado. Quedan fuera del alcance inicial: integración oficial con SEACE, firma digital certificada, reconocimiento automático de imágenes, aplicación móvil nativa, pagos en línea, liquidación final con validez legal definitiva, monitoreo SIEM empresarial y auditoría externa certificada de ciberseguridad. Estas exclusiones son necesarias para que el alcance sea realista y verificable.

CAPÍTULO 5

PLANIFICACIÓN DEL PROYECTO Y PLAN DE CALIDAD

## 5.1. Alcance del Proyecto

El alcance comprende el análisis, diseño, desarrollo, pruebas, despliegue y monitoreo inicial de un sistema web para automatizar el informe mensual de valorización de obra pública. La solución incluirá frontend React/Vite desplegado en GitHub Pages, backend API/BFF desplegado en Railway, base de datos PostgreSQL, almacenamiento de evidencias y documentos, integración controlada con Claude, y Cloudflare como capa de seguridad, DNS, TLS, WAF y rate limiting [16]-[20].

Cuadro 9. Alcance del MVP


<!-- Tabla extraida 12 -->
| Módulo | Incluido en MVP | Observación |
| --- | --- | --- |
| Línea base contractual | Sí | Proyecto, contrato, presupuesto, partidas, cronograma, índices y adelantos. |
| Metrados y evidencias | Sí | Registro por partida, sustento dimensional, fotos, ensayos y validación de saldo. |
| Fiscalización | Sí | Observación, recorte, aprobación, cierre y auditoría. |
| Cálculo económico | Sí | Valorización, factor K, reajustes, amortizaciones y resumen. |
| Generación con Claude | Sí | Borradores editables; no aprobación automática. |
| Exportación documental | Sí | Word/PDF con versión, hash y trazabilidad. |
| Pre-liquidación | Parcial | Historial acumulado y saldos; no liquidación legal definitiva. |
| SEACE/ReFirma/S10 | No en MVP | Diseño preparado para integración futura. |

## 5.2. Enfoque de pruebas

El enfoque de pruebas será progresivo, modular, basado en riesgos y alineado a ISO/IEC/IEEE 29119. No se validarán solo pantallas: se validarán cálculos, estados de workflow, permisos, trazabilidad, generación documental, seguridad, rendimiento y calidad de código. El repositorio ecommerce revisado demuestra prácticas útiles de Vitest, Playwright, CI, seguridad y documentación manual, pero para este sistema se requiere una matriz específica de obra pública [31].

Cuadro 10. Niveles y tipos de pruebas


<!-- Tabla extraida 13 -->
| Nivel/tipo de prueba | Objetivo | Herramienta sugerida | Evidencia |
| --- | --- | --- | --- |
| Unitarias | Validar funciones puras: metrados, valorización, factor K, amortización, validaciones. | Vitest / Jest | Reporte coverage, casos aprobados. |
| Componentes | Validar formularios, tablas, estados y errores desde la UI. | React Testing Library | Reporte unit/component. |
| Integración | Validar frontend-backend-DB-storage-Claude. | Vitest/API tests/Postman/Newman | Reporte API e integración. |
| E2E | Validar flujo completo por roles. | Playwright o Cypress | Videos, screenshots, reporte HTML. |
| Manuales funcionales | Validar escenarios reales por Residente, Supervisor, Entidad. | Checklist UAT | Actas y evidencias. |
| Regresión documental | Comparar salida Word/PDF contra plantilla esperada. | Golden files / snapshot PDF text | Diferencias controladas. |
| Seguridad | Validar autenticación, roles, IDOR, archivos, CORS y secretos. | OWASP ZAP, CodeQL, Gitleaks | Reporte seguridad. |
| Carga | Medir operación bajo concurrencia esperada. | k6/JMeter | Métricas p95/p99, errores. |
| Estrés | Identificar límites sin afectar producción. | k6/JMeter | Reporte límites. |
| Calidad de código | Detectar bugs, duplicación, deuda y vulnerabilidades. | SonarQube/SonarCloud | Quality Gate. |
| Gobierno de IA | Evaluar prompts, fuga de datos, alucinación y revisión humana. | Matriz de evaluación IA | Reporte IA responsable. |

## 5.3. Normas y Estándares de Calidad

Cuadro 11. Aplicación de normas y referencias técnicas [9]-[15]


<!-- Tabla extraida 14 -->
| Norma / referencia | Aplicación en el proyecto | Evidencia verificable |
| --- | --- | --- |
| ISO/IEC 25010 | Define calidad del producto: funcionalidad, rendimiento, compatibilidad, usabilidad, confiabilidad, seguridad, mantenibilidad y portabilidad. | Matriz RNF, métricas, criterios de aceptación. |
| ISO/IEC/IEEE 29119 | Organiza planificación, diseño, ejecución y reporte de pruebas. | Plan de pruebas, casos, defectos, reportes. |
| ISO 9001 | Soporta gestión de calidad, enfoque por procesos, documentación, mejora continua y satisfacción del usuario. | Control documental, acciones correctivas, actas de aceptación. |
| ISO/IEC 27001 | Orienta gestión de seguridad, riesgos, controles y protección de información. | Matriz de riesgos, controles, políticas de acceso. |
| ISO/IEC 42001 | Guía sistema de gestión de IA, riesgos, transparencia y gobernanza. | Política IA, evaluación de prompts, revisión humana. |
| NIST SSDF | Prácticas de desarrollo seguro, revisión, dependencias, secretos y respuesta a vulnerabilidades. | CI DevSecOps, escaneo SAST/SCA/secret scanning. |
| OWASP Top 10 | Riesgos web críticos: control de acceso, fallos criptográficos, inyección, configuración insegura. | DAST, pruebas manuales de seguridad, hardening. |

## 5.4. Plan de Pruebas del Proyecto

El plan de pruebas se ejecutará por iteraciones. Cada módulo deberá pasar pruebas unitarias e integración antes de integrarse al flujo E2E. Ninguna funcionalidad crítica se considerará cerrada si no cuenta con caso de prueba, criterio de aceptación, evidencia y estado de defecto documentado.

Cuadro 12. Fases del plan de pruebas


<!-- Tabla extraida 15 -->
| Fase | Actividades de prueba | Criterio de salida |
| --- | --- | --- |
| Fase 1: Preparación | Definir matriz de requisitos, casos, datos de prueba, ambientes y roles. | Matriz aprobada y ambiente QA disponible. |
| Fase 2: Lógica crítica | Pruebas unitarias de cálculos, validaciones, estados y permisos. | Cobertura mínima de lógica crítica y cero errores de cálculo. |
| Fase 3: Integración | API, base de datos, storage, Claude, exportación y auditoría. | Endpoints críticos correctos y trazables. |
| Fase 4: E2E | Flujos completos: proyecto, periodo, metrados, revisión, IA, exportación, firma. | Escenarios P0/P1 aprobados. |
| Fase 5: Seguridad y rendimiento | SAST, DAST, secretos, carga, estrés, rate limit, control de archivos. | Sin vulnerabilidades críticas; p95 aceptable. |
| Fase 6: UAT | Pruebas manuales con usuarios representativos. | Acta de aceptación o defectos priorizados. |

### 5.4.1. Datos de prueba

Los datos de prueba deberán ser ficticios, anonimizados o tomados como referencia de los modelos entregados, sin usar información sensible real cuando no sea necesario. Se recomienda construir dos obras semilla: una por precios unitarios con adelantos y amortizaciones, y otra a suma alzada sin adelantos, para cubrir ambos comportamientos observados en los documentos de referencia [29], [30].

Cuadro 13. Datos de prueba mínimos


<!-- Tabla extraida 16 -->
| Dato | Ejemplo de prueba |
| --- | --- |
| Proyecto | Obra vial urbana con CUI, ubicación, contrato, entidad, contratista y plazo. |
| Presupuesto | Excel con ítem, descripción, unidad, metrado contractual, precio unitario y parcial. |
| Partidas | Obras provisionales, movimiento de tierras, concreto, pavimentos, señalización. |
| Metrados | Metrado anterior, del mes, acumulado y saldo por ejecutar. |
| Índices | Índices unificados por mes para cálculo de factor K. |
| Evidencias | Fotos con fecha/coordenadas y ensayos de calidad asociados a partidas. |
| Roles | Administrador, Residente, Supervisor, Entidad, Representante Legal. |
| Estados | Abierto, en revisión, observado, corregido, aprobado, cerrado, exportado. |

### 5.4.2. Criterios de aceptación

El flujo completo desde creación del proyecto hasta exportación del expediente se ejecuta sin defectos críticos.

Cero errores en cálculos validados de metrados, valorizaciones, factor K, reajustes y amortizaciones.

100% de pruebas críticas de roles y permisos aprobadas.

No existen vulnerabilidades críticas o altas abiertas en código nuevo.

El expediente se genera en Word y PDF con secciones definidas, datos correctos, versión y hash.

Todo texto generado por Claude puede ser revisado y editado antes de incorporarse al informe final.

Los reportes de pruebas, defectos, evidencias y acta de aceptación quedan anexados.

## 5.5. Lineamientos de Seguridad Informática

El sistema manejará información técnica, contractual, económica, fotografías y datos personales. Por ello, el backend debe concentrar reglas de negocio y secretos; el frontend en GitHub Pages nunca debe contener claves privadas, tokens de Claude, credenciales de base de datos ni permisos administrativos. Cloudflare debe proteger dominios, TLS, WAF y rate limiting. Railway debe almacenar variables de entorno y ejecutar el backend en un contenedor reproducible [16]-[18].

Cuadro 14. Lineamientos de seguridad


<!-- Tabla extraida 17 -->
| Dominio | Lineamiento |
| --- | --- |
| Autenticación | Usuarios autenticados con contraseña robusta, recuperación segura y bloqueo por intentos sospechosos. |
| Autorización | RBAC por rol y verificación en backend, no solo en frontend. |
| Archivos | URLs firmadas o acceso controlado; evitar exposición pública de evidencias sensibles. |
| Auditoría | Eventos críticos: login, importación, edición, observación, aprobación, firma, exportación. |
| Cifrado | TLS extremo a extremo; secretos en variables de entorno; backups protegidos. |
| IA | No enviar datos innecesarios a Claude; usar payload minimizado, prompt versionado y revisión humana. |
| DevSecOps | CodeQL, Gitleaks, análisis de dependencias, Sonar y revisión PR antes de despliegue. |
| Cloudflare | WAF, rate limiting en login/API/IA/exportación, reglas anti-abuso y logs. |

## 5.6. Gestión de riesgos del proyecto

Cuadro 15. Riesgos principales


<!-- Tabla extraida 18 -->
| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Errores en cálculos económicos | Media | Muy alto | Golden tests con datos conocidos, revisión de supervisor y tolerancia decimal definida. |
| Fuga de datos por IA | Media | Alto | Minimización, backend proxy, no enviar archivos completos, revisión de política de datos. |
| Limitaciones de GitHub Pages | Media | Medio | SPA estática, 404 fallback, backend Railway para lógica y secretos. |
| Sobrecarga al exportar expedientes | Media | Medio | Jobs asíncronos, límites de tamaño, colas futuras y pruebas de carga. |
| Observaciones legales por firma | Media | Alto | Declarar firma interna no certificada; integración oficial futura con ReFirma/IOFE. |
| Cambios normativos | Media | Alto | Mantener matriz normativa y revisión periódica. |
| Vulnerabilidades web | Media | Alto | OWASP, DAST/SAST, WAF, rate limiting, revisión de dependencias. |

## 5.7. Instrumentos de evaluación, recolección de datos y validación del sistema

Además del plan de pruebas técnico, el proyecto requiere instrumentos formales de recolección de datos y validación. Estos instrumentos permiten demostrar, con evidencia verificable, si el sistema cumple los requerimientos funcionales, si reduce problemas del proceso manual, si mejora la trazabilidad del expediente mensual y si la integración con Claude mantiene control humano, calidad técnica y seguridad de la información.

En este informe se usa el término “instrumentos” en sentido metodológico y de ingeniería. Incluye fichas de observación, listas de cotejo, fichas de ejecución de pruebas, registros de defectos, matrices de trazabilidad, fichas de validación documental, fichas de evaluación de salidas generadas por IA y encuestas de usabilidad. Su aplicación complementa ISO/IEC/IEEE 29119 para pruebas de software, ISO/IEC 25010 para calidad del producto, ISO 9001 para control de calidad y mejora continua, ISO/IEC 27001 para seguridad de la información e ISO/IEC 42001 para gestión responsable de IA [9]-[13].

Los instrumentos se aplicarán en tres momentos: diagnóstico del proceso actual, validación del sistema durante pruebas y aceptación del MVP. En el diagnóstico se observa cómo se elabora actualmente la valorización mensual con Excel, Word, PDFs, fotografías y documentos físicos. En la validación se comparan los resultados del sistema contra casos patrón, evidencias de base de datos, logs y reportes de pruebas. En la aceptación se verifica que el expediente mensual generado contenga los componentes técnicos, económicos, documentales y de trazabilidad esperados.

### 5.7.1. Variables, dimensiones e indicadores de evaluación

Para ordenar la evaluación se definen dos variables principales. La variable independiente corresponde a la implementación del sistema web con enfoque BPM y apoyo de IA. La variable dependiente corresponde a la optimización del proceso de elaboración del informe mensual de valorización de obra. Adicionalmente, se considera una variable transversal de calidad, seguridad y gobierno de IA, porque el sistema manejará información contractual, económica, evidencias de obra, usuarios por rol y documentos con valor administrativo.

Cuadro 15-A. Variables consideradas para la evaluación del sistema


<!-- Tabla extraida 19 -->
| Tipo | Variable | Descripción evaluable |
| --- | --- | --- |
| Variable independiente | Sistema web con enfoque BPM y apoyo de inteligencia artificial | Evalúa el grado en que la solución implementa módulos, reglas de negocio, workflow, seguridad, trazabilidad, generación documental e integración con Claude. |
| Variable dependiente | Optimización de la elaboración del informe mensual de valorización de obra | Evalúa reducción de tiempo, reducción de errores, completitud documental, confiabilidad de cálculos, mejora de revisión, control de evidencias y calidad del expediente final. |
| Variable transversal | Calidad, seguridad y gobierno responsable de IA | Evalúa cumplimiento de atributos de calidad, controles de acceso, auditoría, protección de datos, validación humana de IA y evidencia de pruebas. |

Cuadro 15-B. Matriz resumida de operacionalización de variables


<!-- Tabla extraida 20 -->
| Var. | Dimensión | Indicador | Ítem | Escala | Fuente de datos | Instrumento |
| --- | --- | --- | --- | --- | --- | --- |
| VI | Línea base contractual | Completitud de datos maestros | IO-01 | Cumple/Parcial/No cumple | Pantallas, BD, presupuesto importado | LC-FUNC-01 |
| VI | Gestión de metrados | Exactitud del metrado calculado | IO-02 | Correcto/Incorrecto/Observado | Caso patrón, planilla del sistema | FCP-01 |
| VI | Valorización económica | Coincidencia de montos anterior, actual, acumulado y saldo | IO-03 | Correcto/Incorrecto | Excel patrón, reporte del sistema | FCP-01 |
| VI | Workflow BPM | Cumplimiento de estados: abierto, revisión, observado, aprobado, cerrado | IO-04 | Pasa/Falla | Logs, historial, pruebas E2E | MT-01 |
| VI | Seguridad por roles | Restricción de acciones según perfil | IO-05 | Pasa/Falla | Usuarios de prueba, auditoría | LC-SEG-01 |
| VI | Trazabilidad | Registro de usuario, fecha, acción, entidad y cambio | IO-06 | Cumple/Parcial/No cumple | Logs, BD, auditoría | LC-SEG-01 |
| VI | IA con Claude | Texto generado basado solo en datos aprobados | IO-07 | Likert 1-5 | Prompt, respuesta, informe generado | FVI-01 |
| VD | Tiempo de elaboración | Duración antes/después del sistema | IO-08 | Minutos/Horas | Observación, cronómetro, bitácora | FO-01 |
| VD | Errores de cálculo | Cantidad de diferencias detectadas | IO-09 | Número de errores | Registro de defectos, comparación patrón | RDF-01 |
| VD | Completitud documental | Presencia de ficha técnica, metrados, valorización, Curva S, ensayos, evidencias, conclusiones y firmas | IO-10 | Cumple/Parcial/No cumple | Word/PDF exportado | FVE-01 |
| VD | Calidad de revisión | Observaciones del supervisor registradas y levantadas | IO-11 | Cumple/Parcial/No cumple | Historial de revisión | LC-FUNC-01 |
| VT | Calidad de software | Casos aprobados, cobertura, defectos críticos, quality gate | IO-12 | Porcentaje/Conteo | CI/CD, Sonar, reportes de prueba | MT-01 |
| VT | Seguridad | Vulnerabilidades críticas o altas abiertas | IO-13 | Cero/Mayor que cero | ZAP, CodeQL, Gitleaks | LC-SEG-01 |
| VT | Usabilidad | Facilidad percibida por usuarios técnicos | IO-14 | Likert 1-5 | Encuesta a usuarios | EU-01 |

### 5.7.2. Catálogo de instrumentos propuestos

El catálogo define cada instrumento, su propósito, momento de aplicación, responsable y evidencia esperada. Esta estructura evita que las pruebas queden solo como una intención general y permite que el equipo demuestre objetivamente qué se probó, con qué datos, quién lo validó y qué resultado se obtuvo.

Cuadro 15-C. Catálogo de instrumentos de validación


<!-- Tabla extraida 21 -->
| Código | Instrumento | Propósito | Momento | Responsable | Evidencia |
| --- | --- | --- | --- | --- | --- |
| FO-01 | Ficha de observación del proceso actual | Diagnosticar el proceso manual o semiautomatizado de valorización. | Antes del desarrollo y antes del piloto | Analista/QA | Ficha firmada, tiempos, incidencias |
| LC-FUNC-01 | Lista de cotejo funcional | Verificar módulos, reglas de negocio, roles y workflow. | Pruebas funcionales y UAT | QA + usuario experto | Checklist con evidencias |
| LC-DOC-01 | Lista de cotejo documental | Comprobar que el expediente mensual exportado esté completo. | Validación documental | Residente/Supervisor | Word/PDF revisado |
| LC-SEG-01 | Lista de cotejo de seguridad, trazabilidad e IA responsable | Verificar controles de acceso, auditoría, protección de datos y gobierno de IA. | Hardening y predespliegue | QA/DevSecOps | Checklist y reportes técnicos |
| FCP-01 | Ficha de ejecución de caso de prueba | Registrar pasos, datos, resultado esperado, obtenido y evidencia. | Cada ciclo de pruebas | QA/Desarrollador | Caso aprobado o defecto |
| RDF-01 | Registro de defectos y no conformidades | Controlar errores, severidad, responsable, estado y cierre. | Durante todo el proyecto | QA/Líder técnico | Backlog de defectos |
| FVE-01 | Ficha de validación del expediente mensual | Validar coherencia técnica, económica y documental del informe generado. | Antes de aceptación | Supervisor/Residente | Acta de validación |
| FVI-01 | Ficha de validación de salidas de Claude | Evaluar precisión, trazabilidad, tono técnico y ausencia de contenido no sustentado. | Pruebas de IA y UAT | Usuario experto + QA | Ficha de evaluación IA |
| EU-01 | Encuesta de usabilidad y satisfacción | Medir facilidad de uso, claridad y utilidad percibida. | Piloto/UAT | Usuarios finales | Resultados tabulados |
| MT-01 | Matriz de trazabilidad | Relacionar requerimientos, casos de prueba, instrumentos, evidencias y defectos. | Planificación y cierre | QA/Líder técnico | Matriz final de cobertura |

### 5.7.3. Escalas, criterios de interpretación y fuentes de datos

Cada instrumento debe usar una escala coherente con el tipo de dato evaluado. Para funcionalidades críticas se recomienda escala binaria Pasa/Falla o Cumple/No cumple, porque una validación de seguridad o cálculo económico no debe aprobarse parcialmente sin observación formal. Para evaluación documental, usabilidad e IA puede usarse escala ordinal, siempre que exista un criterio claro de interpretación.

Cuadro 15-D. Escalas de medición de los instrumentos


<!-- Tabla extraida 22 -->
| Tipo de escala | Valores | Uso recomendado | Interpretación |
| --- | --- | --- | --- |
| Binaria | Pasa/Falla; Cumple/No cumple | Permisos, reglas de negocio, cálculos exactos, exportación, autenticación. | Falla en requisito crítico bloquea la aceptación hasta corrección. |
| Tricotómica | Cumple/Parcial/No cumple | Completitud documental, trazabilidad, evidencias asociadas. | Parcial exige observación, responsable y fecha de subsanación. |
| Likert | 1 a 5 | Usabilidad, claridad, calidad narrativa de IA, satisfacción del usuario. | Promedio menor a 4 en dimensión crítica requiere mejora. |
| Cuantitativa | Minutos, porcentaje, número de errores, cobertura, p95/p99 | Tiempo, defectos, rendimiento, cobertura, disponibilidad. | Se compara contra línea base y umbrales del plan de calidad. |
| Documental | Existe/No existe; versión/hash/fecha/firmas | Word/PDF, actas, evidencias, reportes de CI/CD, logs. | Documento sin versión o evidencia no se considera válido. |

Cuadro 15-E. Fuentes de datos consideradas


<!-- Tabla extraida 23 -->
| Fuente de datos | Descripción | Uso en la validación |
| --- | --- | --- |
| Proceso actual | Entrevista breve, observación directa, cronómetro, archivos Excel/Word/PDF, carpeta de evidencias, cuaderno de obra o equivalente. | Permite establecer línea base de tiempo, errores, reprocesos y puntos críticos. |
| Sistema web | Base de datos, pantallas, logs de auditoría, archivos exportados, evidencias adjuntas, historial de estados, hashes de documentos. | Permite verificar cumplimiento funcional, trazabilidad y consistencia de datos. |
| Pruebas automatizadas | Reportes de Vitest/Jest, Playwright/Cypress, Newman, k6/JMeter, Sonar, CodeQL, Gitleaks, OWASP ZAP. | Permite evidenciar calidad, seguridad, rendimiento y regresión. |
| Usuarios expertos | Residente, Supervisor/Inspector, Representante Legal, Entidad/Monitor, Administrador. | Permite validar utilidad real, completitud documental y aceptación operativa. |
| Claude/IA | Prompt, datos enviados, respuesta generada, versión del prompt, revisión humana, texto aprobado o rechazado. | Permite auditar la generación narrativa y evitar uso de información no sustentada. |

### 5.7.4. Procedimiento de aplicación de instrumentos

La aplicación de instrumentos seguirá un ciclo controlado. Primero se define el objetivo de la medición y el módulo evaluado. Luego se selecciona el instrumento, se preparan datos de prueba, se ejecuta la evaluación, se adjuntan evidencias, se registran defectos y se emite una conclusión. Ningún instrumento debe llenarse sin evidencia mínima verificable, como captura, registro, exportación, log, reporte de CI/CD o firma de validación.

Cuadro 15-F. Procedimiento de aplicación de instrumentos


<!-- Tabla extraida 24 -->
| Paso | Fase | Actividad | Salida esperada |
| --- | --- | --- | --- |
| 1 | Preparación | Definir módulo, requerimientos, datos de prueba, usuario responsable y ambiente. | Plan de ejecución y datos patrón listos. |
| 2 | Aplicación | Ejecutar observación, checklist, prueba manual, prueba automatizada o validación documental. | Instrumento diligenciado con resultado inicial. |
| 3 | Evidencia | Adjuntar captura, log, archivo exportado, reporte de prueba, hash o registro de base de datos. | Carpeta de evidencias versionada. |
| 4 | Registro de hallazgos | Clasificar defecto, no conformidad, mejora u observación. | Registro RDF-01 actualizado. |
| 5 | Corrección y retest | Asignar responsable, corregir, ejecutar nuevamente la prueba y cerrar si corresponde. | Resultado final aprobado o pendiente. |
| 6 | Cierre | Consolidar métricas y emitir conclusión por módulo e instrumento. | Reporte final de validación del MVP. |

### 5.7.5. Validación de instrumentos por juicio de expertos

Para que los instrumentos sean defendibles académicamente, se recomienda validarlos mediante juicio de expertos antes de su aplicación formal. Los expertos pueden ser un docente metodólogo, un ingeniero de sistemas con experiencia en calidad de software y un ingeniero civil o supervisor con experiencia en valorizaciones de obra. Cada experto revisará claridad, pertinencia, relevancia y suficiencia de los ítems.

Cuadro 15-G. Criterios para juicio de expertos de los instrumentos


<!-- Tabla extraida 25 -->
| Criterio | Descripción | Escala sugerida | Decisión |
| --- | --- | --- | --- |
| Claridad | El ítem se entiende sin ambigüedad. | 1 = bajo, 2 = medio, 3 = alto | Reformular si obtiene promedio menor a 2.5. |
| Pertinencia | El ítem se relaciona con la dimensión evaluada. | 1 = bajo, 2 = medio, 3 = alto | Eliminar o reubicar si no corresponde. |
| Relevancia | El ítem aporta evidencia importante para aceptar el sistema. | 1 = bajo, 2 = medio, 3 = alto | Mantener si impacta calidad, seguridad o objetivo. |
| Suficiencia | El conjunto de ítems cubre la dimensión completa. | 1 = bajo, 2 = medio, 3 = alto | Agregar ítems si quedan vacíos de medición. |

El resultado de la validación por expertos debe documentarse en un acta o ficha de validación. La versión aprobada de cada instrumento se identificará con código, versión, fecha y responsable. Cualquier modificación posterior debe quedar registrada para mantener trazabilidad metodológica.

### 5.7.6. Relación de instrumentos con pruebas de software y aceptación del MVP

Cuadro 15-H. Relación entre instrumentos, pruebas y aceptación


<!-- Tabla extraida 26 -->
| Área evaluada | Instrumentos | Tipo de prueba asociado | Criterio de aceptación |
| --- | --- | --- | --- |
| Requerimientos funcionales | LC-FUNC-01, FCP-01, MT-01 | Casos manuales, integración, E2E | Aprobado si no existen defectos críticos o altos abiertos. |
| Cálculos económicos | FCP-01, RDF-01, MT-01 | Unitarias, integración, comparación con datos patrón | Aprobado si los montos coinciden dentro de la tolerancia definida. |
| Expediente mensual | LC-DOC-01, FVE-01 | Validación documental, regresión de exportación | Aprobado si contiene secciones obligatorias y datos correctos. |
| Seguridad y trazabilidad | LC-SEG-01, MT-01 | Pruebas de roles, IDOR, auditoría, escaneo de seguridad | Aprobado si no hay vulnerabilidades críticas/altas abiertas. |
| Claude/IA | FVI-01, LC-SEG-01 | Evaluación de prompts, revisión humana, pruebas de seguridad IA | Aprobado si el texto es sustentado, revisable y no expone datos indebidos. |
| Usabilidad | EU-01, FO-01 | UAT, observación y encuesta | Aprobado si las dimensiones críticas obtienen promedio >= 4/5. |

CAPÍTULO 6

DISEÑO DEL SISTEMA

## 6.1. Arquitectura Conceptual del Sistema

La arquitectura propuesta separa claramente la interfaz, la API de negocio, la base de datos, el almacenamiento documental, la generación de documentos, la integración con Claude y la capa de seguridad perimetral. Esta separación evita que el frontend contenga secretos o reglas críticas, facilita pruebas automatizadas y permite escalar los componentes con mayor control.

Cuadro 16. Componentes conceptuales


<!-- Tabla extraida 27 -->
| Componente | Responsabilidad | Tecnología recomendada |
| --- | --- | --- |
| Frontend SPA | Interfaz para usuarios, formularios, tablas, visualización de reportes y flujo de trabajo. | React, Vite, TypeScript, Tailwind, shadcn/ui o MUI. |
| Backend API/BFF | Reglas de negocio, autenticación complementaria, cálculos, generación documental, integración IA. | Node.js Express/NestJS o Laravel; despliegue Railway. |
| Base de datos | Persistencia relacional de proyectos, contratos, partidas, metrados, auditoría y versiones. | PostgreSQL en Railway o Supabase PostgreSQL. |
| Storage | Evidencias, ensayos, documentos generados y plantillas. | Railway volume/S3 compatible/Supabase Storage/Cloudflare R2. |
| Claude Gateway | Preparar payloads, ejecutar prompts, registrar versión y controlar respuestas. | Servicio backend con Anthropic API. |
| Cloudflare | DNS, TLS, WAF, CDN, rate limiting y protección de endpoints. | Cloudflare DNS/WAF/Rules/Turnstile opcional. |
| CI/CD | Validaciones, tests, build y despliegue. | GitHub Actions. |


<!-- Tabla extraida 28 -->
| Figura 3. Arquitectura conceptualGitHub Pages -> Cloudflare -> Frontend SPA -> Railway API -> PostgreSQL/Storage/Claude API. Incluir WAF, rate limiting, CI/CD y auditoría. |
| --- |

## 6.2. Modelo UML del Sistema

El modelo UML debe incluir al menos diagramas de casos de uso, clases/dominio y secuencia. Las imágenes pueden incorporarse posteriormente; a continuación se define el contenido mínimo para diagramarlas.

Cuadro 17. Diagramas UML requeridos


<!-- Tabla extraida 29 -->
| Diagrama | Elementos mínimos |
| --- | --- |
| Casos de uso | Actores: Administrador, Residente, Supervisor, Entidad, Representante Legal, Servicio Claude. Casos: crear proyecto, cargar presupuesto, registrar metrado, observar, aprobar, generar informe, firmar, consultar. |
| Clases / dominio | Usuario, Rol, Proyecto, Contrato, Partida, PeriodoValorizacion, Metrado, Evidencia, Observacion, Valorizacion, Reajuste, Documento, Firma, Auditoria, PromptIA. |
| Secuencia: registro de metrado | Residente -> Frontend -> API -> DB -> Auditoría -> respuesta con cálculo de saldo. |
| Secuencia: revisión supervisor | Supervisor -> API -> reglas -> DB -> auditoría -> notificación al residente. |
| Secuencia: generación IA | Residente -> API -> validador -> Claude -> revisión humana -> documento -> auditoría. |

## 6.3. Diseño de Interfaces de Usuario

Cuadro 18. Interfaces principales


<!-- Tabla extraida 30 -->
| Pantalla | Descripción funcional |
| --- | --- |
| Login | Ingreso seguro, recuperación, mensajes de error sin revelar información sensible. |
| Dashboard | Resumen de proyectos, periodos abiertos, observaciones, avances y alertas. |
| Proyecto | Ficha técnica, contrato, presupuesto, cronograma, índices y usuarios asignados. |
| Importación de presupuesto | Carga Excel, previsualización, errores por fila, validación de totales. |
| Periodo de valorización | Estado del periodo, fechas, avance y acciones disponibles por rol. |
| Metrados | Tabla editable, fórmula dimensional, saldo, evidencias asociadas y validaciones. |
| Evidencias | Galería por partida, metadatos, ensayos y documentos anexos. |
| Revisión supervisor | Comparación de metrado solicitado/aprobado, observaciones y recortes. |
| Cálculos económicos | Resumen de valorización, reajuste, amortización, IGV y monto estimado. |
| Generación con IA | Secciones generadas, comparación, edición y aprobación humana. |
| Exportación | Vista previa, selección Word/PDF, firmas, hash y versión. |
| Entidad pública | Consulta de expediente aprobado y trazabilidad visible de solo lectura. |


<!-- Tabla extraida 31 -->
| Figura 4. Prototipos de interfazEspacio reservado para pantallas Figma o capturas. Se recomienda incluir dashboard, planilla de metrados, revisión supervisor y generador de informe. |
| --- |

## 6.4. Diseño de Base de Datos

La base de datos debe estar normalizada, con claves primarias UUID, marcas de tiempo, usuario creador/modificador y relaciones explícitas. Las acciones críticas deben generar registros de auditoría. Las tablas se agrupan por dominios para mantener claridad y facilitar pruebas.

Cuadro 19. Modelo de datos propuesto


<!-- Tabla extraida 32 -->
| Tabla | Propósito | Campos clave | Relaciones |
| --- | --- | --- | --- |
| usuarios | Usuarios del sistema, vinculación a identidad y estado. | id, email, nombre, estado, rol_id | roles, auditoria |
| roles | Catálogo de roles y nivel de acceso. | id, nombre, descripcion | usuarios, permisos |
| permisos | Permisos por módulo y acción. | id, recurso, accion | roles_permisos |
| proyectos | Obras registradas. | id, cui, nombre, ubicacion, entidad_id | contratos, periodos |
| empresas | Contratistas, entidades, supervisores. | id, ruc, razon_social, tipo | contratos |
| contratos | Datos contractuales de obra. | id, proyecto_id, monto, plazo, modalidad | proyectos |
| partidas | Presupuesto por partidas. | id, proyecto_id, item, descripcion, unidad, metrado, precio | metrados, valorizaciones |
| cronograma_valorizado | Programado por mes y partida. | id, proyecto_id, periodo, monto_programado | periodos |
| periodos_valorizacion | Valorizaciones mensuales. | id, proyecto_id, numero, mes, estado | metrados, documentos |
| metrados | Metrados por partida y periodo. | id, periodo_id, partida_id, anterior, mes, acumulado | partidas, evidencias |
| sustentos_dimensionales | Detalle de cálculo del metrado. | id, metrado_id, largo, ancho, alto, veces, total | metrados |
| evidencias | Fotos, ensayos y anexos. | id, periodo_id, partida_id, tipo, url, hash | partidas, auditoria |
| observaciones | Observaciones del supervisor. | id, metrado_id, usuario_id, descripcion, estado | metrados |
| valorizaciones | Resumen económico del periodo. | id, periodo_id, bruto, reajuste, amortizacion, neto | periodos |
| formula_polinomica | Fórmula de reajuste. | id, contrato_id, descripcion | monomios |
| monomios | Coeficientes e índices. | id, formula_id, coeficiente, indice_id | indices |
| indices_unificados | Catálogo de índices. | id, codigo, descripcion | valores_indices |
| valores_indices | Valores mensuales. | id, indice_id, mes, anio, valor | reajustes |
| reajustes | Factor K y reajuste calculado. | id, periodo_id, k, monto_reajuste | periodos |
| adelantos | Adelanto directo/materiales. | id, contrato_id, tipo, monto | amortizaciones |
| amortizaciones | Amortización por periodo. | id, periodo_id, adelanto_id, monto | adelantos |
| documentos_generados | Word/PDF exportados. | id, periodo_id, tipo, version, hash, url | firmas, auditoria |
| firmas | Firmas electrónicas internas. | id, documento_id, usuario_id, hash, fecha | documentos |
| prompts_ia | Versiones de prompt y parámetros. | id, codigo, version, plantilla | generaciones_ia |
| generaciones_ia | Solicitudes y respuestas de Claude. | id, periodo_id, prompt_id, estado, resumen_payload | documentos |
| auditoria | Registro de acciones críticas. | id, usuario_id, accion, entidad, entidad_id, fecha | usuarios |
| defectos | Registro de errores de pruebas y producción. | id, modulo, severidad, estado, descripcion | calidad |

## 6.5. Reglas de integridad y auditoría

Toda modificación de metrados, observaciones, aprobaciones, firmas y exportaciones debe registrarse en auditoría.

Las tablas de cálculo deben conservar valores usados en el momento de la generación, no depender solo de datos maestros mutables.

Los documentos exportados deben conservar hash y versión para demostrar integridad.

Las evidencias deben tener hash de archivo, usuario, fecha y relación a partida/periodo.

Las respuestas de IA deben conservar metadatos, prompt versionado, usuario solicitante y estado de revisión.

CAPÍTULO 7

ARQUITECTURA TECNOLÓGICA DEL SISTEMA

## 7.1. Tecnologías del Frontend

El frontend se desarrollará con React, Vite y TypeScript. Esta combinación permite crear una aplicación SPA estática compatible con GitHub Pages, siempre que la lógica de negocio sensible se mantenga en el backend. Tailwind CSS y shadcn/ui o MUI permitirán construir formularios, tablas y paneles con consistencia visual.

Rutas: React Router con configuración compatible con GitHub Pages. Para evitar errores 404 en recarga directa, se debe publicar un fallback 404.html o usar hash routing.

Estado: React Query/TanStack Query para datos remotos; Zustand o Context para estado local ligero.

Validación: Zod/Yup para formularios y validación previa; la validación definitiva ocurre en backend.

Seguridad: no guardar tokens sensibles en localStorage si se puede evitar; expiración, refresh seguro y limpieza de sesión.

Build: vite build con base path configurado según repositorio o dominio personalizado.

## 7.2. Tecnologías del Backend

El backend se recomienda como API/BFF desplegada en Railway. Puede implementarse en Node.js con Express/NestJS por afinidad con el zip revisado, o Laravel si el equipo domina PHP. Para el MVP se sugiere Node.js + Express/NestJS + TypeScript por su integración directa con Vite, Playwright, GitHub Actions y SDK de Anthropic.

Cuadro 20. Servicios del backend


<!-- Tabla extraida 33 -->
| Servicio backend | Responsabilidad |
| --- | --- |
| Auth/session adapter | Validar token, rol y permisos en cada petición. |
| Obras service | Proyectos, contratos, presupuesto y cronograma. |
| Metrados service | Registro, validación, saldos y evidencias. |
| Valorización service | Cálculos económicos, reajustes, amortizaciones y reportes. |
| Workflow service | Estados, observaciones, aprobación y cierre. |
| Document service | Plantillas, generación Word/PDF, hash y versiones. |
| Claude service | Payload minimizado, prompt, respuesta, evaluación y auditoría. |
| Audit service | Registro de acciones críticas e historial. |

## 7.3. Base de Datos del Sistema

La base de datos recomendada es PostgreSQL. Puede desplegarse en Railway para mantener el stack centralizado o mantenerse en Supabase si el equipo desea aprovechar Auth, Storage y RLS ya planteados en el informe base. En ambos escenarios, el backend debe aplicar reglas de autorización y pruebas de acceso por rol.

## 7.4. Infraestructura de Desarrollo

Cuadro 21. Infraestructura de desarrollo


<!-- Tabla extraida 34 -->
| Elemento | Herramienta |
| --- | --- |
| Control de versiones | Git y GitHub. |
| Frontend local | Node.js LTS, pnpm/npm, Vite dev server. |
| Backend local | Node.js, Docker, variables .env.local. |
| Base de datos local | Docker Compose con PostgreSQL o Supabase local. |
| Pruebas unitarias | Vitest/Jest. |
| Pruebas E2E | Playwright o Cypress. |
| Calidad | ESLint, Prettier, SonarQube/SonarCloud. |
| Seguridad | CodeQL, Gitleaks, npm audit/Snyk/Dependabot, OWASP ZAP. |
| Carga | k6 o JMeter. |
| Despliegue | GitHub Pages, Railway, Cloudflare. |

## 7.5. Integración con Claude

Claude se integrará únicamente desde el backend, nunca desde el frontend. El backend construirá un payload con datos aprobados del periodo: ficha técnica, resumen de metrados, avance, observaciones, ensayos, incidencias, retrasos y resultados económicos. No se enviarán archivos completos ni datos innecesarios. El resultado será un borrador que el Residente revisa, edita y aprueba antes de pasar al expediente.

Cuadro 22. Controles de IA con Claude [13], [19]-[24]


<!-- Tabla extraida 35 -->
| Control | Descripción |
| --- | --- |
| Prompt versionado | Cada plantilla tendrá código y versión para reproducibilidad. |
| Payload minimizado | Solo datos necesarios para la sección solicitada. |
| RAG opcional | Para etapas futuras, usar una base de conocimiento con normativa y plantillas controladas. |
| Evaluación | Checklist: coherencia, no invención, datos citados, tono técnico, ausencia de datos sensibles. |
| Human-in-the-loop | Ningún texto se incorpora sin revisión humana. |
| Auditoría | Registrar usuario, fecha, sección, prompt, modelo y estado. |

CAPÍTULO 8

DESARROLLO DEL SISTEMA

## 8.1. Iteración 1: Configuración Inicial del Proyecto

Crear monorepo o repositorios separados: frontend, backend, infraestructura/documentación.

Configurar React + Vite + TypeScript, ESLint, Prettier, alias y estructura por dominios.

Configurar API backend con health check, manejo centralizado de errores y variables de entorno.

Configurar Docker Compose local con PostgreSQL y migraciones iniciales.

Configurar GitHub Actions para lint, test, typecheck y build.

## 8.2. Iteración 2: Seguridad base y gestión de usuarios

Implementar autenticación, roles, permisos y guards de rutas.

Crear matriz de permisos por rol y pruebas unitarias/E2E de acceso.

Configurar auditoría de login, cambios de usuario y acciones administrativas.

Agregar Gitleaks, CodeQL, Dependabot y Sonar en CI.

## 8.3. Iteración 3: Parametrización contractual y presupuesto

Implementar creación de proyecto, contrato, empresas, ubicación y responsables.

Implementar carga de presupuesto Excel/CSV con prevalidación y reporte de errores por fila.

Registrar partidas, precios unitarios, metrados contractuales, cronograma valorizado e índices base.

Crear pruebas de importación, totales y validaciones.

## 8.4. Iteración 4: Metrados, evidencias y workflow de fiscalización

Implementar periodo mensual, planilla de metrados, sustento dimensional y evidencias.

Validar saldos contractuales y bloqueo de excedentes.

Implementar envío a revisión, observaciones, recortes, levantamiento y aprobación.

Registrar auditoría de cada cambio y generar notificaciones internas.

## 8.5. Iteración 5: Cálculos económicos

Implementar valorización mensual por partida.

Implementar avance programado vs ejecutado y Curva S de datos.

Implementar factor K, reajuste, amortización de adelanto directo/materiales y resumen neto.

Validar con golden data de los modelos documentales entregados y casos ficticios.

## 8.6. Iteración 6: Generación documental con Claude

Construir plantillas de secciones: memoria, sustento técnico, incidencias, conclusiones y recomendaciones.

Implementar servicio Claude con payload minimizado, prompt versionado, retries controlados y logs.

Crear editor de textos generados y flujo de aprobación humana.

Implementar exportación Word/PDF con índice, cuadros y anexos.

## 8.7. Iteración 7: Pre-liquidación, firmas y consulta de entidad

Consolidar historial de valorizaciones y saldos acumulados.

Implementar firma electrónica interna con hash, fecha, usuario y rol.

Implementar consulta de expedientes aprobados para la Entidad Pública.

Validar trazabilidad y restricciones de solo lectura.

## 8.8. Iteración 8: Hardening, pruebas finales y despliegue

Ejecutar regresión completa, UAT, seguridad, carga y estrés controlado.

Aprobar Quality Gate y cerrar defectos críticos/altos.

Desplegar frontend en GitHub Pages, backend en Railway y dominio en Cloudflare.

Generar reporte final de pruebas, acta de aceptación y guía de operación.

CAPÍTULO 9

CONTROL DE VERSIONES Y GESTIÓN DEL REPOSITORIO

## 9.1. Repositorio del Proyecto

El repositorio debe alojarse en GitHub. Se recomienda un monorepo con carpetas /frontend, /backend, /database, /docs, /tests y /infra, o repositorios separados si el equipo prefiere despliegues independientes. El zip revisado muestra una estructura con frontend, BFF, AI service, workflows, manuales de pruebas y controles de seguridad que puede servir como base de prácticas, no como reemplazo directo del dominio de obra [31].

## 9.2. Estrategia de Control de Versiones

Cuadro 23. Estrategia de ramas


<!-- Tabla extraida 36 -->
| Rama | Uso |
| --- | --- |
| main | Código estable y desplegable a producción/MVP. |
| develop | Integración de funcionalidades validadas para QA. |
| feature/<modulo> | Desarrollo de funcionalidades específicas. |
| fix/<defecto> | Corrección de defectos encontrados en pruebas. |
| release/<version> | Preparación de entrega, pruebas de regresión y documentación. |
| hotfix/<incidente> | Corrección urgente sobre main. |

## 9.3. Gestión de Ramas del Proyecto

Todo cambio debe entrar por Pull Request con revisión mínima de un integrante.

Los PR deben enlazar requerimiento, caso de prueba y evidencia cuando aplique.

No se permite merge si falla lint, test, typecheck, build, Sonar o secret scanning.

Los cambios de base de datos deben incluir migración, rollback o nota de compatibilidad.

Los prompts de IA deben versionarse igual que el código fuente.

## 9.4. Registro de Commits Relevantes

Cuadro 24. Convención de commits


<!-- Tabla extraida 37 -->
| Tipo de commit | Ejemplo |
| --- | --- |
| feat | feat(metrados): agregar validación de saldo contractual por partida |
| fix | fix(reajustes): corregir redondeo del factor K a tres decimales |
| test | test(workflow): cubrir observación y levantamiento por supervisor |
| docs | docs(calidad): actualizar matriz de pruebas manuales |
| sec | sec(auth): bloquear acceso directo a documentos no aprobados |
| chore | chore(ci): agregar gitleaks y codeql al pipeline |

CAPÍTULO 10

DOCKERIZACIÓN Y DESPLIEGUE DE MÓDULOS

## 10.1. Introducción a Docker en el Proyecto

Docker permitirá ejecutar el backend, base de datos local, pruebas y servicios auxiliares de forma reproducible. Aunque el frontend se publique en GitHub Pages como estático, puede incluirse un contenedor de preview para QA local.

## 10.2. Dockerización del Backend

El backend debe incluir un Dockerfile multi-stage, usuario no root, instalación reproducible de dependencias, health check y lectura de configuración mediante variables de entorno. Railway puede desplegar desde GitHub detectando el proyecto o usando Dockerfile [17].

Cuadro 25. Variables de entorno del backend


<!-- Tabla extraida 38 -->
| Variable | Descripción |
| --- | --- |
| NODE_ENV | Entorno de ejecución: development, test, production. |
| PORT | Puerto asignado por Railway. |
| DATABASE_URL | Cadena de conexión PostgreSQL. |
| JWT_SECRET / AUTH_SECRET | Secreto de sesión o firma de tokens. |
| ANTHROPIC_API_KEY | Clave de Claude; solo en backend. |
| CORS_ORIGIN | Dominio del frontend publicado. |
| STORAGE_BUCKET | Bucket o proveedor de evidencias. |
| LOG_LEVEL | Nivel de logging. |

## 10.3. Dockerización del Frontend

Para producción en GitHub Pages, el frontend se compila como archivos estáticos. La configuración de Vite debe definir correctamente base path, URL pública de API y modo de compilación. Nunca se deben incluir secretos en variables VITE_, porque quedan expuestas en el bundle.

## 10.4. Orquestación con Docker Compose

Docker Compose se usará para el entorno local y de pruebas. Debe contener backend, PostgreSQL, migraciones y, opcionalmente, un servicio de mock de Claude para pruebas automatizadas sin consumir la API real.

Cuadro 26. Servicios Docker Compose


<!-- Tabla extraida 39 -->
| Servicio | Uso en local/QA |
| --- | --- |
| backend | API principal con hot reload o build de producción. |
| postgres | Base de datos local con volumen de desarrollo. |
| migrator | Ejecución de migraciones antes de pruebas. |
| mock-claude | Simulación de respuestas IA para pruebas reproducibles. |
| frontend-preview | Preview de build estático para pruebas E2E. |

## 10.5. Despliegue del Frontend en GitHub Pages

Configurar vite.config con base: "/nombre-repositorio/" si no se usa dominio personalizado.

Crear workflow de GitHub Actions que ejecute npm ci, lint, test, typecheck, build y despliegue Pages.

Agregar 404.html para rutas SPA o usar hash router.

Configurar variables públicas solo para URL de API y entorno; no incluir claves privadas.

Si se usa dominio propio, verificar el dominio en GitHub y configurar CNAME/DNS en Cloudflare.

## 10.6. Despliegue del Backend en Railway

Crear proyecto Railway conectado al repositorio o subcarpeta backend.

Configurar variables de entorno y secretos desde Railway Variables.

Agregar health endpoint /health y /ready para verificación.

Configurar dominio api.dominio.pe apuntando a Railway mediante Cloudflare.

Activar logs, restart policy y alertas básicas.

## 10.7. Configuración de Cloudflare

Cuadro 27. Cloudflare como capa de seguridad [18]


<!-- Tabla extraida 40 -->
| Elemento Cloudflare | Configuración recomendada |
| --- | --- |
| DNS | app.dominio.pe para frontend y api.dominio.pe para backend. |
| SSL/TLS | Modo Full/Strict con certificados válidos. |
| WAF | Reglas para bloquear patrones de inyección, bots abusivos y países no requeridos si aplica. |
| Rate limiting | Límites en /api/auth, /api/ai/generate, /api/documents/export y endpoints de archivos. |
| Cache | Cachear assets estáticos; no cachear respuestas autenticadas de API. |
| Turnstile opcional | Proteger login, recuperación y formularios de alto riesgo. |
| Logs | Revisar eventos WAF y tráfico anómalo durante UAT y producción. |

CAPÍTULO 11

ESTRATEGIA DE PRUEBAS DE SOFTWARE

## 11.1. Enfoque de Pruebas del Proyecto

La estrategia de pruebas se basa en riesgo, trazabilidad y evidencia. Cada requerimiento funcional y no funcional debe estar vinculado a uno o más casos de prueba. Los módulos de mayor riesgo son: cálculo de metrados, valorización, reajustes, amortizaciones, seguridad por roles, generación documental e integración con Claude.

## 11.2. Niveles de Pruebas Aplicados

Cuadro 28. Niveles de prueba


<!-- Tabla extraida 41 -->
| Nivel | Alcance | Ejemplos |
| --- | --- | --- |
| Unitario | Funciones puras y reglas de negocio. | calcularMetrado, calcularK, validarSaldo, calcularAmortizacion. |
| Componente | Interacción UI aislada. | Formulario de metrado, tabla de partidas, modal de observación. |
| Integración | Comunicación entre módulos. | Registrar metrado + guardar evidencia + auditoría. |
| Sistema | Aplicación completa en ambiente QA. | Flujo desde proyecto hasta exportación. |
| Aceptación | Validación por usuarios. | Residente y Supervisor ejecutan casos UAT. |

## 11.3. Tipos de Pruebas Ejecutadas

Cuadro 29. Tipos de prueba


<!-- Tabla extraida 42 -->
| Tipo | Criterio de diseño |
| --- | --- |
| Funcional | Debe validar requerimientos del módulo y casos alternos. |
| Validación de datos | Entradas vacías, formatos inválidos, decimales, fechas y archivos. |
| Reglas de negocio | Excedentes, saldos, periodos cerrados, estados y roles. |
| Seguridad | Acceso no autorizado, IDOR, subida de archivos, CORS, secretos, rate limit. |
| Usabilidad | Claridad de mensajes, navegación, filtros, accesibilidad básica. |
| Rendimiento | Tiempos de carga, importación, generación y consulta. |
| Compatibilidad | Chrome, Edge, Firefox y vista tablet. |
| Recuperación | Reintento ante error de Claude, DB, storage o exportación. |
| IA | No alucinación evidente, no datos inventados, tono formal y revisión humana. |

## 11.4. Plan de Ejecución de Pruebas

Las pruebas se ejecutarán en cada pull request y antes de cada entrega. Las pruebas manuales se reservarán para flujos de negocio, aceptación, usabilidad y verificación documental que requieren criterio humano.

Cuadro 30. Calendario de ejecución


<!-- Tabla extraida 43 -->
| Momento | Pruebas | Responsable |
| --- | --- | --- |
| Cada PR | Lint, typecheck, unitarias, componentes, SAST/secret scanning. | Desarrollador / CI |
| Merge a develop | Integración, API, migraciones, build y Sonar. | CI / Líder técnico |
| Semanal | E2E principales y regresión de módulos modificados. | QA / Equipo |
| Antes de release | E2E completo, seguridad, carga, UAT y documentación. | QA / Usuarios clave |
| Post despliegue | Smoke tests, health checks, logs y monitoreo. | DevOps / Equipo |

## 11.5. Matriz de pruebas manuales principales

Cuadro 31. Matriz de pruebas manuales principales


<!-- Tabla extraida 44 -->
| ID | Escenario manual | Resultado esperado | Prioridad |
| --- | --- | --- | --- |
| PM-01 | Admin crea proyecto completo | Proyecto creado con contrato, roles y estado activo. | P0 |
| PM-02 | Carga presupuesto correcto | Partidas importadas y totales cuadran. | P0 |
| PM-03 | Carga presupuesto con columnas faltantes | Sistema rechaza y muestra errores por fila/columna. | P0 |
| PM-04 | Abrir periodo de valorización | Periodo queda abierto y listo para metrados. | P0 |
| PM-05 | Registrar metrado válido | Metrado del mes y acumulado se calculan correctamente. | P0 |
| PM-06 | Intentar exceder saldo contractual | Sistema bloquea salvo modificación aprobada. | P0 |
| PM-07 | Adjuntar foto con metadatos | Foto queda vinculada a partida y periodo. | P1 |
| PM-08 | Adjuntar ensayo de calidad | Documento queda asociado y visible en revisión. | P1 |
| PM-09 | Enviar a revisión | Estado cambia a en revisión; Residente no edita sin corrección. | P0 |
| PM-10 | Supervisor observa partida | Observación visible y trazable para Residente. | P0 |
| PM-11 | Supervisor recorta metrado | Metrado aprobado refleja recorte y motivo. | P0 |
| PM-12 | Residente levanta observación | Estado cambia a corregido/en revisión. | P0 |
| PM-13 | Supervisor aprueba periodo | Periodo queda aprobado técnicamente. | P0 |
| PM-14 | Calcular valorización | Montos anterior, actual, acumulado y saldo correctos. | P0 |
| PM-15 | Calcular factor K | Resultado coincide con datos de prueba. | P0 |
| PM-16 | Calcular amortización | Amortización directa/materiales correcta. | P0 |
| PM-17 | Generar borrador con Claude | Texto usa datos aprobados y es editable. | P1 |
| PM-18 | Claude con datos insuficientes | Sistema no genera y explica requisito faltante. | P1 |
| PM-19 | Exportar Word | Documento contiene secciones, cuadros y versión. | P0 |
| PM-20 | Exportar PDF | PDF legible, con hash y sin datos de borrador. | P0 |
| PM-21 | Firmar como Residente | Firma interna registrada con usuario y fecha. | P0 |
| PM-22 | Firmar como Supervisor | Firma interna registrada y documento final queda bloqueado. | P0 |
| PM-23 | Entidad consulta expediente | Solo ve aprobados y descarga permitida. | P0 |
| PM-24 | Entidad intenta editar | Acceso denegado y evento auditado. | P0 |
| PM-25 | Usuario sin rol accede a API directa | Respuesta 403/401 y auditoría. | P0 |
| PM-26 | Archivo privado por URL directa | Acceso denegado o URL expirada. | P0 |
| PM-27 | Importar archivo malicioso o extensión no permitida | Sistema rechaza archivo. | P0 |
| PM-28 | Reabrir periodo cerrado | Solo flujo autorizado de rectificación. | P1 |
| PM-29 | Generar pre-liquidación | Historial acumulado correcto. | P1 |
| PM-30 | Post-despliegue smoke | Login, dashboard, API health y exportación básica OK. | P0 |

CAPÍTULO 12

AUTOMATIZACIÓN DE PRUEBAS

## 12.1. Herramientas de Automatización

Cuadro 32. Herramientas de automatización


<!-- Tabla extraida 45 -->
| Herramienta | Uso |
| --- | --- |
| Vitest/Jest | Pruebas unitarias de funciones de cálculo, validación y servicios. |
| React Testing Library | Pruebas de componentes desde la perspectiva del usuario. |
| Playwright/Cypress | Flujos E2E multirol y regresión de interfaz. |
| Supertest/Newman | Pruebas de API backend. |
| k6/JMeter | Carga y estrés de endpoints críticos. |
| SonarQube/SonarCloud | Calidad, deuda técnica, duplicación, bugs y vulnerabilidades. |
| CodeQL | Análisis estático de seguridad. |
| Gitleaks | Detección de secretos en repositorio. |
| OWASP ZAP | DAST básico contra ambiente QA. |
| GitHub Actions | Orquestación de pruebas, build y despliegue. |

## 12.2. Configuración del Entorno de Pruebas

qa: entorno con datos ficticios y roles preconfigurados.

test: base de datos limpia, migraciones automáticas y mocks de Claude.

production: solo smoke tests no destructivos y monitoreo.

Variables separadas por ambiente; nunca reutilizar claves productivas en pruebas.

Archivos de prueba controlados: presupuestos válidos, inválidos, grandes y con decimales extremos.

## 12.3. Scripts de Pruebas Automatizadas

Los scripts deben organizarse por tipo y dominio. El zip revisado incluye scripts de calidad, unitarias, E2E por categorías, Sonar y controles de seguridad que pueden adaptarse. Para este proyecto se recomienda la siguiente estructura:

Cuadro 33. Scripts recomendados


<!-- Tabla extraida 46 -->
| Script | Propósito |
| --- | --- |
| npm run test | Unitarias y componentes. |
| npm run test:coverage | Cobertura para lógica crítica. |
| npm run test:e2e:smoke | Flujos mínimos post-build. |
| npm run test:e2e:workflow | Flujo completo de valorización. |
| npm run test:e2e:security | Accesos por roles, rutas protegidas y archivos. |
| npm run test:api | Contratos de API y validaciones backend. |
| npm run test:load | Carga con k6/JMeter. |
| npm run quality | Lint, typecheck, test, build y Sonar preflight. |

## 12.4. Ejecución Automática de Pruebas

La ejecución automática debe implementarse en GitHub Actions. El pipeline mínimo debe bloquear despliegues si fallan pruebas P0, si se detectan secretos, si el build falla o si el Quality Gate no se cumple.

Cuadro 34. Pipeline CI/CD recomendado


<!-- Tabla extraida 47 -->
| Job CI/CD | Acciones |
| --- | --- |
| validate | Instalar dependencias, verificar formato, lint y typecheck. |
| unit | Ejecutar unitarias/componentes y coverage. |
| api | Levantar DB de prueba, migrar y ejecutar tests de API. |
| e2e | Levantar frontend/backend QA y ejecutar Playwright/Cypress. |
| security | Gitleaks, CodeQL, dependency review y ZAP baseline. |
| sonar | Enviar cobertura y evaluar Quality Gate. |
| deploy-pages | Desplegar frontend en GitHub Pages si main/release. |
| deploy-railway | Desplegar backend en Railway mediante integración GitHub o CLI. |
| post-deploy | Smoke tests, health checks y verificación de Cloudflare. |

## 12.5. Automatización de pruebas de IA

Las pruebas de IA no deben depender siempre del modelo real. Se debe usar un mock para pruebas deterministas y un set controlado de pruebas contra Claude para evaluar calidad. Los casos deben verificar que la respuesta no invente montos, no mencione partidas inexistentes, respete el periodo, use tono técnico, no incluya datos sensibles innecesarios y sea editable.

Cuadro 35. Pruebas específicas de IA


<!-- Tabla extraida 48 -->
| ID | Prueba IA | Criterio |
| --- | --- | --- |
| IA-01 | Payload minimizado | No contiene documentos completos ni datos fuera del periodo. |
| IA-02 | Prompt injection | Instrucciones maliciosas en observaciones no alteran reglas del sistema. |
| IA-03 | No alucinación | No crea partidas, montos ni fechas no presentes en datos. |
| IA-04 | Tono técnico | Redacción formal para informe de obra pública. |
| IA-05 | Revisión humana | No se exporta texto IA sin aprobación del usuario. |
| IA-06 | Trazabilidad | Se registra prompt, versión, usuario y estado. |

CAPÍTULO 13

MÉTRICAS DE CALIDAD

## 13.1. Ejecución de Casos de Pruebas

Al momento de elaborar este informe no se han ejecutado pruebas reales sobre el sistema final de valorizaciones, por lo que las métricas siguientes se plantean como línea base objetivo. Durante la implementación deberán reemplazarse por resultados reales, evidencias, capturas y reportes generados por CI/CD.

Cuadro 36. Métricas objetivo


<!-- Tabla extraida 49 -->
| Métrica | Meta para MVP |
| --- | --- |
| Casos P0 aprobados | 100% antes de entrega. |
| Defectos críticos abiertos | 0. |
| Defectos altos abiertos | 0 o justificados con plan y aceptación formal. |
| Errores en cálculos críticos | 0 en datos de prueba validados. |
| Cobertura lógica crítica | >= 80% en cálculos, validaciones, permisos y documentos. |
| Quality Gate Sonar | Aprobado. |
| Vulnerabilidades críticas/altas | 0 en código nuevo. |
| Acciones críticas auditadas | 100%. |
| Tiempo p95 login/dashboard | <= 3 segundos bajo carga esperada. |
| Tiempo de generación documental | Objetivo <= 60 segundos para expediente estándar; proceso asíncrono si excede. |
| Errores en E2E smoke post-despliegue | 0. |

## 13.2. Registro de Defectos

Cuadro 37. Estructura del registro de defectos


<!-- Tabla extraida 50 -->
| Campo | Descripción |
| --- | --- |
| ID | Código único del defecto. |
| Módulo | Línea base, metrados, fiscalización, cálculos, IA, seguridad, despliegue. |
| Severidad | Crítico, alto, medio, bajo. |
| Prioridad | P0, P1, P2, P3. |
| Descripción | Qué ocurre, dónde y con qué datos. |
| Pasos para reproducir | Secuencia exacta. |
| Resultado esperado/obtenido | Comparación objetiva. |
| Evidencia | Captura, video, log, request, documento. |
| Responsable | Asignado para corrección. |
| Estado | Nuevo, asignado, corregido, retest, cerrado, diferido. |

## 13.3. Métricas de Calidad del Software

Las métricas deben analizarse según ISO/IEC 25010. No basta con medir cobertura; se debe evaluar adecuación funcional, confiabilidad, seguridad, mantenibilidad, portabilidad y compatibilidad. Un sistema puede tener buena cobertura y aun así fallar si sus pruebas no validan el dominio técnico de obra.

Cuadro 38. Métricas por característica de calidad


<!-- Tabla extraida 51 -->
| Característica ISO/IEC 25010 | Indicador práctico |
| --- | --- |
| Adecuación funcional | % de RF aprobados y trazados a pruebas. |
| Eficiencia de desempeño | p95/p99 de endpoints y operaciones críticas. |
| Compatibilidad | Navegadores y resoluciones aprobadas. |
| Usabilidad | Errores de usuario, tiempo de tarea, satisfacción UAT. |
| Confiabilidad | Tasa de fallos, recuperación ante error y consistencia de datos. |
| Seguridad | Incidentes, vulnerabilidades, accesos denegados correctamente. |
| Mantenibilidad | Deuda técnica, duplicación, complejidad, cobertura y modularidad. |
| Portabilidad | Éxito de despliegue en GitHub Pages/Railway y configuración reproducible. |

## 13.4. Evaluación de Calidad basada en Estándares

La evaluación final debe generar un reporte de conformidad interna, indicando qué evidencias demuestran alineamiento con cada norma. Este reporte no equivale a una certificación ISO, pero sí permite sustentar que el desarrollo siguió criterios de ingeniería, calidad, seguridad y trazabilidad.

Cuadro 39. Evidencias por estándar


<!-- Tabla extraida 52 -->
| Referencia | Evidencia esperada |
| --- | --- |
| ISO/IEC 25010 | Matriz de RNF y métricas por característica. |
| ISO/IEC/IEEE 29119 | Plan, diseño, ejecución y reporte de pruebas. |
| ISO 9001 | Control documental, mejora continua, acta de aceptación. |
| ISO/IEC 27001 | Matriz de riesgos y controles de seguridad. |
| ISO/IEC 42001 | Política de IA, evaluación de prompts y supervisión humana. |
| NIST SSDF | CI seguro, revisión de dependencias, secretos y SAST. |
| OWASP Top 10 | Reporte DAST/manual y mitigaciones. |

CAPÍTULO 14

IMPLEMENTACIÓN Y MONITOREO

## 14.1. Preparación del Entorno de Implementación

Antes del despliegue deben existir ambientes diferenciados: local, QA/staging y producción. La base de datos de producción no debe usarse para pruebas de estrés. Los datos de prueba deben estar anonimizados y separados. El dominio, TLS, CORS, variables de entorno y reglas Cloudflare deben validarse antes de liberar acceso a usuarios.

Cuadro 40. Checklist pre-despliegue


<!-- Tabla extraida 53 -->
| Checklist pre-despliegue | Estado esperado |
| --- | --- |
| Variables de backend en Railway | Configuradas y sin exposición en repositorio. |
| Build frontend | Generado con URL de API correcta. |
| CORS | Solo dominios autorizados. |
| Base de datos | Migraciones aplicadas y respaldo inicial. |
| Storage | Buckets privados y URLs firmadas. |
| Cloudflare | DNS, TLS, WAF y rate limit activos. |
| CI/CD | Pipeline verde y Quality Gate aprobado. |
| Smoke tests | Login, dashboard, API health y consulta base aprobados. |

## 14.2. Implementación del Sistema

La implementación recomendada será gradual. Primero se publica el backend en Railway y se verifica /health; luego se configura Cloudflare para api.dominio.pe; después se publica el frontend en GitHub Pages y se apunta app.dominio.pe; finalmente se ejecutan smoke tests y pruebas manuales de rol.

Backend: despliegue desde GitHub/Railway con variables y migraciones.

Frontend: despliegue GitHub Pages desde rama main o GitHub Actions.

Cloudflare: DNS proxied para API, TLS Full/Strict, WAF y rate limits.

Documentos: verificar generación Word/PDF y almacenamiento privado.

Claude: validar clave, límites, manejo de error y fallback si la API no responde.

## 14.3. Verificación de Funcionamiento

Cuadro 41. Smoke tests post-despliegue


<!-- Tabla extraida 54 -->
| Prueba post-despliegue | Resultado esperado |
| --- | --- |
| GET /health backend | 200 OK, versión y timestamp. |
| Acceso frontend | Carga assets sin errores 404. |
| Login usuario QA | Acceso correcto según rol. |
| Crear proyecto demo | Registro exitoso y auditado. |
| Registrar metrado demo | Cálculo correcto. |
| Generar borrador IA demo | Respuesta controlada y editable. |
| Exportar PDF demo | Archivo generado, hash registrado. |
| Entidad descarga aprobado | Acceso solo a documento aprobado. |
| Intento de acceso no autorizado | 403/401 y evento registrado. |
| Cloudflare WAF/rate limit | Eventos visibles y reglas no bloquean flujo legítimo. |

## 14.4. Monitoreo del Sistema

El monitoreo inicial debe cubrir disponibilidad, errores, rendimiento, seguridad y uso de IA. Railway provee logs del servicio, Cloudflare registra eventos de tráfico y WAF, y el backend debe emitir logs estructurados para errores de negocio. Para el MVP no se exige un SIEM empresarial, pero sí una bitácora revisable.

Cuadro 42. Monitoreo recomendado


<!-- Tabla extraida 55 -->
| Área | Métrica / control |
| --- | --- |
| Disponibilidad | Health checks, uptime y reinicios del backend. |
| Errores | Tasa de 4xx/5xx, errores de exportación y errores Claude. |
| Rendimiento | p95 por endpoint: login, metrados, valorización, exportación. |
| Seguridad | Eventos WAF, bloqueos por rate limit, intentos fallidos, IDOR rechazados. |
| Base de datos | Uso de CPU/memoria, conexiones, locks y tiempos de consulta. |
| IA | Número de generaciones, costo estimado, secciones, rechazos por datos insuficientes. |
| Calidad | Defectos producción, tiempo de resolución y acciones correctivas. |

## 14.5. Respaldo, recuperación e incidentes

Realizar backup automático de PostgreSQL según frecuencia definida por criticidad.

Conservar versiones de documentos generados y hashes para integridad.

Definir RPO y RTO del MVP; por ejemplo RPO 24h y RTO 8h para entorno inicial.

Documentar procedimiento de restauración y ejecutar simulacro antes de entrega final.

Definir canal y responsable para incidentes de seguridad, pérdida de datos o caída del servicio.

## CONCLUSIONES

El informe base contiene una buena intención funcional, pero requería mayor detalle técnico para ser defendible como sistema serio. La versión fortalecida incorpora arquitectura, seguridad, pruebas, despliegue, gobierno de IA, trazabilidad y criterios de aceptación.

El proceso de valorización mensual no debe tratarse como simple generación documental; debe modelarse como workflow BPM con estados, responsables, evidencias y auditoría.

El despliegue del frontend en GitHub Pages es viable si se mantiene como aplicación estática y el backend conserva secretos y reglas de negocio en Railway.

Cloudflare es una capa recomendable para DNS, TLS, WAF, rate limiting y control perimetral, especialmente en endpoints de login, IA, exportación y archivos.

Claude puede aportar valor en la redacción de memoria descriptiva, sustento técnico, conclusiones y recomendaciones, pero solo como asistente con revisión humana obligatoria.

Las pruebas deben cubrir el dominio de obra: metrados, valorizaciones, factor K, reajustes, amortizaciones, evidencias, roles, aprobación, documentos y seguridad.

La normativa peruana, las ISO y las buenas prácticas de DevSecOps obligan a documentar evidencia, trazabilidad, control de calidad y seguridad desde el diseño.

## RECOMENDACIONES

Priorizar primero la línea base contractual, metrados, fiscalización y cálculo económico antes de agregar funcionalidades avanzadas.

Implementar Claude después de contar con datos validados y plantillas documentales estables; no usar IA para aprobar ni calcular sin reglas verificadas.

Construir golden tests con ejemplos de valorización mensual y factor K antes de desarrollar exportación final.

Configurar desde el inicio GitHub Actions con lint, typecheck, pruebas, Sonar, CodeQL y Gitleaks.

No exponer claves ni lógica sensible en GitHub Pages; toda integración con Claude y base de datos debe pasar por backend Railway.

Configurar Cloudflare con WAF y rate limiting antes de publicar usuarios externos.

Mantener una matriz legal actualizada, porque el régimen de contrataciones públicas peruano está en transición normativa.

Completar los diagramas, capturas y anexos visuales en Figma/UML usando los espacios reservados del presente documento.

## REFERENCIAS

[1] ORGANISMO ESPECIALIZADO PARA LAS CONTRATACIONES PÚBLICAS EFICIENTES. Ley N.° 32069, Ley General de Contrataciones Públicas y su Reglamento. Lima: OECE, 2026. Disponible en: https://www.gob.pe/institucion/oece/colecciones/45029-ley-n-32069-ley-general-de-contrataciones-publicas-y-su-reglamento

[2] MINISTERIO DE ECONOMÍA Y FINANZAS. Decreto Supremo N.° 009-2025-EF, Reglamento de la Ley N.° 32069. Lima: MEF, 2025. Disponible en: https://www.gob.pe/institucion/mef/normas-legales/6401561-009-2025-ef

[3] ORGANISMO ESPECIALIZADO PARA LAS CONTRATACIONES PÚBLICAS EFICIENTES. Directiva N.° 018-2025-OECE/CD: registro de valorizaciones de obra a través del SEACE. Lima: OECE, 2025. Disponible en: https://www.gob.pe/institucion/oece/normas-legales/7472600-018-2025-oece-cd

[4] ORGANISMO SUPERVISOR DE LAS CONTRATACIONES DEL ESTADO. Directiva N.° 001-2022-OSCE/CD: gestión de valorizaciones de obra a través del SEACE. Lima: OSCE, 2022. Disponible en: https://www.gob.pe/institucion/osce/normas-legales/2651401-001-2022-osce-cd

[5] ORGANISMO SUPERVISOR DE LAS CONTRATACIONES DEL ESTADO. Directiva N.° 009-2020-OSCE/CD: lineamientos para el uso del Cuaderno de Obra Digital. Lima: OSCE, 2020. Disponible en: https://www.gob.pe/institucion/oece/normas-legales/1040675-009-2020-osce-cd-v-01

[6] CONGRESO DE LA REPÚBLICA DEL PERÚ. Ley N.° 29733, Ley de Protección de Datos Personales. Lima: Congreso, 2011. Disponible en: https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733

[7] PRESIDENCIA DEL CONSEJO DE MINISTROS. Decreto Legislativo N.° 1412, Ley de Gobierno Digital. Lima: PCM, 2018. Disponible en: https://www.gob.pe/institucion/pcm/normas-legales/289706-1412

[8] CONGRESO DE LA REPÚBLICA DEL PERÚ. Ley N.° 27269, Ley de Firmas y Certificados Digitales. Lima: Congreso, 2000. Disponible en: https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/292289-27269

[9] INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO/IEC 25010:2023 Systems and software engineering - Systems and software Quality Requirements and Evaluation (SQuaRE) - Product quality model. Geneva: ISO, 2023. Disponible en: https://www.iso.org/standard/78176.html

[10] INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO/IEC/IEEE 29119-1:2022 Software and systems engineering - Software testing - Part 1: General concepts. Geneva: ISO, 2022. Disponible en: https://www.iso.org/standard/81291.html

[11] INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO 9001:2015 Quality management systems - Requirements. Geneva: ISO, 2015. Disponible en: https://www.iso.org/standard/62085.html

[12] INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO/IEC 27001:2022 Information security management systems. Geneva: ISO, 2022. Disponible en: https://www.iso.org/standard/27001

[13] INTERNATIONAL ORGANIZATION FOR STANDARDIZATION. ISO/IEC 42001:2023 Artificial intelligence management system. Geneva: ISO, 2023. Disponible en: https://www.iso.org/standard/42001

[14] NATIONAL INSTITUTE OF STANDARDS AND TECHNOLOGY. Secure Software Development Framework (SSDF) Version 1.1, NIST SP 800-218. Gaithersburg: NIST, 2022. Disponible en: https://csrc.nist.gov/pubs/sp/800/218/final

[15] OPEN WORLDWIDE APPLICATION SECURITY PROJECT. OWASP Top 10 Web Application Security Risks. OWASP Foundation, 2025. Disponible en: https://owasp.org/www-project-top-ten/

[16] GITHUB DOCS. GitHub Pages: static site hosting and publishing sources. GitHub, 2026. Disponible en: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

[17] RAILWAY DOCS. Deploy an Express app and service variables. Railway, 2026. Disponible en: https://docs.railway.com/guides/express

[18] CLOUDFLARE DOCS. Web Application Firewall and Rate Limiting Rules. Cloudflare, 2026. Disponible en: https://developers.cloudflare.com/waf/

[19] ANTHROPIC. Claude Enterprise: governance, data controls and enterprise administration. Anthropic, 2026. Disponible en: https://www.anthropic.com/product/enterprise

[20] ANTHROPIC. Build with Claude: API guides, best practices, evaluations and prompt engineering. Anthropic, 2026. Disponible en: https://www.anthropic.com/learn/build-with-claude

[21] ANTHROPIC SUPPORT. What are Projects? Knowledge bases and workspaces in Claude. Anthropic, 2026. Disponible en: https://support.claude.com/en/articles/9517075-what-are-projects

[22] ANTHROPIC. Updates to consumer terms and privacy policy. Anthropic, 2025. Disponible en: https://www.anthropic.com/news/updates-to-our-consumer-terms

[23] TAIWO, R. et al. Generative AI in the Construction Industry: Opportunities, Challenges and Future Directions. arXiv, 2024. Disponible en: https://arxiv.org/abs/2402.09939

[24] MA, L. et al. Adopting Large Language Models in the Construction Industry. Buildings, 2025, 15(23), 4296. Disponible en: https://www.mdpi.com/2075-5309/15/23/4296

[25] ROYAL INSTITUTION OF CHARTERED SURVEYORS. Artificial Intelligence in Construction Report. RICS, 2025. Disponible en: https://www.rics.org/news-insights/artificial-intelligence-in-construction-report

[26] CONSTRUCTION MANAGEMENT ASSOCIATION OF AMERICA. The Need for AI in Construction. CMAA, 2024. Disponible en: https://www.cmaanet.org/sites/default/files/resource/AI%20in%20Construction_0.pdf

[27] FIDIC e IPFA. AI-powered technology in infrastructure and construction. FIDIC/IPFA, 2024. Disponible en: https://www.ipfa.org/wp-content/uploads/2024/10/FINAL_FIDIC-Infra-Report.pdf

[28] Documento base proporcionado por el equipo: Plantilla Estructura de proyecto final.docx (5).pdf. Huancayo, 2026.

[29] Documento de referencia proporcionado por el equipo: Informe Mensual de Supervisión de Obra N.° 04, marzo 2019, obra Los Geranios, Piura.

[30] Documento de referencia proporcionado por el equipo: Informe Mensual de Avance de Obra N.° 001, octubre 2018, obra Calle Oriente, Chiclayo.

[31] Código fuente de referencia proporcionado por el equipo: calzatura-vilchez-v3-main.zip, estructura ecommerce con pruebas unitarias, E2E, seguridad, CI/CD y documentación manual.

## ANEXOS

## Anexo 1. Matriz de trazabilidad resumida

Cuadro 43. Trazabilidad resumida


<!-- Tabla extraida 56 -->
| Requerimientos | Casos de uso | Pruebas | Referencia |
| --- | --- | --- | --- |
| RF-01 a RF-03 | CU-01, CU-02 | PM-01, pruebas RBAC | ISO 25010, ISO 27001 |
| RF-04 a RF-08 | CU-03, CU-04 | PM-02, PM-03, unitarias importación | ISO 25010, ISO 29119 |
| RF-09 a RF-16 | CU-05, CU-06, CU-07 | PM-04 a PM-08, unitarias metrado | ISO 25010 |
| RF-17 a RF-21 | CU-08 a CU-11 | PM-09 a PM-13, E2E workflow | ISO 9001, ISO 29119 |
| RF-22 a RF-27 | CU-12 | PM-14 a PM-16, golden tests | ISO 25010 |
| RF-28 a RF-33 | CU-13, CU-14 | PM-17 a PM-20, snapshot documental | ISO 42001, ISO 29119 |
| RF-34 a RF-38 | CU-15, CU-16, CU-17 | PM-21 a PM-24, seguridad | ISO 27001, Ley 27269 |

## Anexo 2. Checklist de seguridad

Cuadro 44. Checklist de seguridad


<!-- Tabla extraida 57 -->
| ID | Control |
| --- | --- |
| SEC-01 | No hay claves de Claude, DB o JWT en frontend o repositorio. |
| SEC-02 | CORS solo acepta dominio frontend autorizado. |
| SEC-03 | Cloudflare WAF activo para API. |
| SEC-04 | Rate limit configurado en login, IA y exportación. |
| SEC-05 | Archivos privados con URL firmada o control backend. |
| SEC-06 | Roles verificados en backend para cada endpoint. |
| SEC-07 | Auditoría activa en acciones críticas. |
| SEC-08 | CodeQL, Gitleaks y dependencia review pasan en CI. |
| SEC-09 | ZAP baseline sin alertas críticas. |
| SEC-10 | Backups y prueba de restauración documentados. |

## Anexo 3. Plantilla de evaluación de salida de Claude

Cuadro 45. Evaluación de contenido generado por IA


<!-- Tabla extraida 58 -->
| Campo | Descripción | Valor |
| --- | --- | --- |
| Criterio | Pregunta de evaluación | Cumple |
| Fidelidad | ¿El texto usa solo datos existentes del periodo? | Sí/No |
| Coherencia | ¿La narración coincide con avance físico y financiero? | Sí/No |
| Tono | ¿El lenguaje es formal y técnico para obra pública? | Sí/No |
| Privacidad | ¿No expone datos innecesarios o sensibles? | Sí/No |
| Trazabilidad | ¿Se registró prompt, versión y usuario? | Sí/No |
| Revisión | ¿El usuario revisó y editó antes de exportar? | Sí/No |

## Anexo 4. Definición de terminado (Definition of Done)

Requerimiento implementado y vinculado a caso de uso.

Pruebas unitarias/integración/E2E correspondientes aprobadas.

Sin defectos críticos o altos abiertos.

Código revisado por Pull Request.

Sonar Quality Gate aprobado.

Sin secretos detectados y sin vulnerabilidades críticas.

Documentación actualizada.

Evidencia de prueba adjunta.

Despliegue QA verificado con smoke test.

## Anexo 5. Brechas detectadas al reutilizar el ecommerce como referencia

El zip de ecommerce revisado aporta una base importante de cultura de calidad: pruebas unitarias, E2E, BFF, pruebas de seguridad, flujos CI/CD, Sonar y documentación manual. Sin embargo, no cubre por sí mismo el dominio de valorizaciones de obra pública. Las siguientes brechas deben cerrarse antes de considerar el sistema apto para el proyecto actual [31].

Cuadro 46. Brechas de reutilización del zip


<!-- Tabla extraida 59 -->
| Área existente aprovechable | Brecha para el sistema de obra | Acción requerida |
| --- | --- | --- |
| Vitest/unitarias | No existen cálculos de metrado, factor K, reajuste o amortización. | Crear módulo de cálculos con golden tests. |
| Playwright E2E | Flujos ecommerce no cubren Residente/Supervisor/Entidad. | Crear flujos E2E multirol de valorización. |
| BFF/API | Reglas comerciales de ecommerce no aplican al dominio de obra. | Diseñar servicios de contratos, partidas, metrados y documentos. |
| Seguridad y guards | Debe adaptarse a archivos de obra, roles y expedientes privados. | Matriz RBAC/IDOR/storage específica. |
| Manual tests | Deben cubrir UAT de obra pública y documentos de valorización. | Actualizar matriz manual PM-01 a PM-30. |
| CI/CD | Despliegue actual orientado a Firebase/Render. | Adaptar a GitHub Pages/Railway/Cloudflare. |
| AI service | Predicción ecommerce no equivale a generación documental con Claude. | Implementar Claude Gateway y pruebas IA responsable. |

## Anexo 6. Matriz de operacionalización de variables

La siguiente matriz amplía la operacionalización resumida del Capítulo 5. Permite relacionar variables, dimensiones, indicadores, ítems, escala, fuente de datos e instrumento. Debe usarse como matriz principal para justificar qué se mide y cómo se valida el impacto del sistema en el proceso de valorización mensual.

Tabla A6-1. Matriz completa de operacionalización


<!-- Tabla extraida 60 -->
| Variable | Dimensión | Indicador | Ítem | Escala | Fuente | Instrumento |
| --- | --- | --- | --- | --- | --- | --- |
| VI: Sistema BPM + IA | Parametrización contractual | Datos obligatorios completos | MO-01: ¿El sistema registra CUI, entidad, contrato, modalidad, presupuesto, plazo, fechas y responsables? | Cumple/Parcial/No | Pantalla de proyecto, BD | LC-FUNC-01 |
| VI: Sistema BPM + IA | Presupuesto base | Carga correcta de partidas | MO-02: ¿Las partidas importadas conservan código, descripción, unidad, metrado, precio unitario y parcial? | Correcto/Incorrecto | Excel patrón, BD | FCP-01 |
| VI: Sistema BPM + IA | Cronograma valorizado | Comparación programado vs ejecutado | MO-03: ¿El sistema calcula avance programado, ejecutado, acumulado y atraso/adelanto? | Correcto/Incorrecto | Cronograma, reporte | FCP-01 |
| VI: Sistema BPM + IA | Metrados | Cálculo dimensional verificable | MO-04: ¿El metrado permite registrar fórmula, dimensiones, cantidad, partida y sustento? | Cumple/Parcial/No | Formulario, planilla | LC-FUNC-01 |
| VI: Sistema BPM + IA | Metrados | Validación contra saldo contractual | MO-05: ¿El sistema bloquea o advierte metrados que exceden el saldo permitido? | Pasa/Falla | Caso de prueba, log | FCP-01 |
| VI: Sistema BPM + IA | Evidencias | Vinculación por partida y periodo | MO-06: ¿Las fotografías, ensayos y documentos se asocian al metrado correspondiente? | Cumple/Parcial/No | Storage, BD, UI | LC-FUNC-01 |
| VI: Sistema BPM + IA | Workflow BPM | Estados trazables | MO-07: ¿El periodo pasa por abierto, revisión, observado, aprobado y cerrado según reglas? | Pasa/Falla | Historial, E2E | MT-01 |
| VI: Sistema BPM + IA | Fiscalización | Observaciones gestionadas | MO-08: ¿El supervisor puede observar, recortar, aprobar y el residente levantar observaciones? | Pasa/Falla | Pantallas, logs | LC-FUNC-01 |
| VI: Sistema BPM + IA | Valorización | Monto contractual del mes y acumulado | MO-09: ¿La valorización coincide con el cálculo patrón por partida y acumulado? | Correcto/Incorrecto | Excel patrón, reporte | FCP-01 |
| VI: Sistema BPM + IA | Reajustes y amortizaciones | Cálculo económico sustentado | MO-10: ¿El sistema calcula factor K, reajuste, amortización y monto neto según datos configurados? | Correcto/Incorrecto | Datos patrón, reporte | FCP-01 |
| VI: Sistema BPM + IA | Generación documental | Exportación Word/PDF versionada | MO-11: ¿El expediente se genera con versión, hash, fecha, usuario y periodo? | Cumple/Parcial/No | Documento exportado, auditoría | FVE-01 |
| VI: Sistema BPM + IA | Claude/IA | Redacción basada en datos aprobados | MO-12: ¿El texto generado se sustenta en metrados, avance, observaciones y evidencias aprobadas? | Likert 1-5 | Prompt, respuesta, informe | FVI-01 |
| VI: Sistema BPM + IA | Claude/IA | Control humano | MO-13: ¿El usuario puede revisar, editar, aprobar o rechazar el texto antes de exportar? | Pasa/Falla | UI, auditoría | LC-SEG-01 |
| VI: Sistema BPM + IA | Seguridad | Autenticación y autorización | MO-14: ¿Cada rol solo accede a las funciones autorizadas? | Pasa/Falla | Usuarios de prueba | LC-SEG-01 |
| VI: Sistema BPM + IA | Trazabilidad | Auditoría de cambios críticos | MO-15: ¿Se registran usuario, fecha, acción, dato afectado y resultado? | Cumple/Parcial/No | Logs, BD | LC-SEG-01 |
| VD: Optimización informe | Tiempo | Reducción del tiempo total | MO-16: ¿Cuánto tiempo toma elaborar el expediente antes y después del sistema? | Horas/minutos | Observación, cronómetro | FO-01 |
| VD: Optimización informe | Errores | Reducción de inconsistencias | MO-17: ¿Cuántas diferencias de cálculo o datos se detectan en revisión? | Número de errores | RDF-01, revisión | RDF-01 |
| VD: Optimización informe | Completitud | Secciones obligatorias presentes | MO-18: ¿El expediente contiene ficha técnica, metrados, valorización, Curva S, ensayos, panel y firmas? | Cumple/Parcial/No | Word/PDF exportado | FVE-01 |
| VD: Optimización informe | Confiabilidad | Coherencia entre módulos | MO-19: ¿Los datos del resumen coinciden con metrados, valorización y acumulados? | Correcto/Incorrecto | Reporte, BD | FVE-01 |
| VD: Optimización informe | Revisión | Trazabilidad de observaciones | MO-20: ¿Cada observación tiene responsable, fecha, estado y respuesta? | Cumple/Parcial/No | Historial workflow | LC-FUNC-01 |
| VD: Optimización informe | Evidencia técnica | Sustento verificable | MO-21: ¿Cada partida valorizada tiene sustento mínimo cuando corresponde? | Cumple/Parcial/No | Fotos, ensayos, archivos | LC-DOC-01 |
| VD: Optimización informe | Usabilidad | Facilidad de uso | MO-22: ¿El usuario percibe que el sistema facilita registrar, revisar y exportar? | Likert 1-5 | Encuesta UAT | EU-01 |
| VT: Calidad/Seguridad/IA | Calidad de software | Casos aprobados | MO-23: ¿El porcentaje de casos críticos aprobados cumple el umbral definido? | Porcentaje | Reporte de pruebas | MT-01 |
| VT: Calidad/Seguridad/IA | Seguridad | Vulnerabilidades abiertas | MO-24: ¿Existen vulnerabilidades críticas o altas abiertas antes del despliegue? | Cero/Mayor que cero | ZAP, CodeQL, Gitleaks | LC-SEG-01 |
| VT: Calidad/Seguridad/IA | Rendimiento | Tiempo de respuesta | MO-25: ¿Las operaciones críticas cumplen p95 definido bajo carga esperada? | Milisegundos/segundos | k6/JMeter | FCP-01 |
| VT: Calidad/Seguridad/IA | Mantenibilidad | Quality Gate | MO-26: ¿El código supera análisis estático y reglas mínimas de calidad? | Pasa/Falla | Sonar/CI | MT-01 |
| VT: Calidad/Seguridad/IA | Gobierno IA | Revisión y registro del uso de IA | MO-27: ¿Cada salida de Claude queda asociada a prompt, datos, usuario, fecha y decisión? | Cumple/Parcial/No | Logs IA, auditoría | FVI-01 |
| VT: Calidad/Seguridad/IA | Privacidad | Minimización de datos enviados a IA | MO-28: ¿El prompt evita datos personales innecesarios y adjuntos no autorizados? | Pasa/Falla | Prompt, configuración | LC-SEG-01 |

## Anexo 7. Ficha de observación del proceso actual de valorización

Código: FO-01. Objetivo: registrar evidencia del proceso actual de elaboración del informe mensual de valorización antes de implementar el sistema. Aplicación: una sesión real o simulada con el residente y/o supervisor, usando documentos de obra, hojas de cálculo, archivos Word/PDF, fotografías y evidencias disponibles.

Tabla A7-1. Datos generales de la observación


<!-- Tabla extraida 61 -->
| Campo | Dato | Campo | Dato |
| --- | --- | --- | --- |
| Proyecto/obra | ______________________________ | Periodo observado | ______________________________ |
| Observador | ______________________________ | Fecha | ____/____/________ |
| Área/persona observada | ______________________________ | Duración | ________ minutos |
| Herramientas usadas | Excel / Word / PDF / S10 / Carpeta fotos / Cuaderno obra / Otro | Versión de ficha | FO-01 v1.0 |

Tabla A7-2. Ítems de observación del proceso actual


<!-- Tabla extraida 62 -->
| N.° | Aspecto observado | Escala/valor | Evidencia u observación |
| --- | --- | --- | --- |
| 1 | La información contractual se encuentra centralizada y actualizada. | No/Parcial/Sí | Documento fuente o sistema usado |
| 2 | El presupuesto base se encuentra en una sola versión controlada. | No/Parcial/Sí | Nombre de archivo/versión |
| 3 | Los metrados se calculan con fórmulas visibles y revisables. | No/Parcial/Sí | Archivo o captura |
| 4 | Las evidencias fotográficas están asociadas a partidas específicas. | No/Parcial/Sí | Carpeta/foto/partida |
| 5 | Los ensayos de laboratorio se incorporan al informe sin reproceso manual excesivo. | No/Parcial/Sí | Ensayo/documento |
| 6 | El avance programado vs ejecutado se calcula sin copiar datos entre múltiples archivos. | No/Parcial/Sí | Archivo origen/destino |
| 7 | El supervisor registra observaciones con fecha, responsable y estado. | No/Parcial/Sí | Correo/documento/reunión |
| 8 | Existe trazabilidad de cambios realizados en metrados o valorizaciones. | No/Parcial/Sí | Historial/versiones |
| 9 | El informe mensual contiene ficha técnica, metrados, valorización, Curva S y panel. | No/Parcial/Sí | Documento final |
| 10 | Se identifican errores de cálculo, copia, formato o versión durante la elaboración. | Número | Registrar cantidad |
| 11 | Tiempo utilizado para consolidar metrados y valorización. | Minutos/Horas | Cronómetro |
| 12 | Tiempo utilizado para redactar memoria, conclusiones y recomendaciones. | Minutos/Horas | Cronómetro |
| 13 | Tiempo utilizado para compilar evidencias y panel fotográfico. | Minutos/Horas | Cronómetro |
| 14 | Cantidad de archivos manipulados para generar el expediente final. | Número | Lista de archivos |
| 15 | Riesgos observados: duplicidad, pérdida de evidencia, cálculo manual, retraso, falta de aprobación. | Texto | Detalle del hallazgo |

Criterio de interpretación: los ítems con respuesta “No” o “Parcial” representan brechas del proceso actual. Los tiempos observados serán la línea base para comparar la mejora del sistema. Las observaciones cualitativas deben convertirse en hallazgos del diagnóstico y vincularse a requerimientos o pruebas.

## Anexo 8. Lista de cotejo funcional del sistema

Código: LC-FUNC-01. Objetivo: validar que los módulos funcionales del MVP estén implementados según el alcance. Escala: C = cumple, P = cumple parcialmente, N = no cumple, NA = no aplica. Todo ítem crítico con N bloquea la aceptación del módulo.

Tabla A8-1. Lista de cotejo funcional


<!-- Tabla extraida 63 -->
| N.° | Módulo | Criterio de verificación | Escala | Evidencia |
| --- | --- | --- | --- | --- |
| 1 | Gestión de proyectos | Permite crear, editar y consultar obra con datos contractuales mínimos. | C/P/N/NA | Captura/BD |
| 2 | Usuarios y roles | Permite configurar Administrador, Residente, Supervisor, Entidad y Representante Legal. | C/P/N/NA | Usuarios de prueba |
| 3 | Presupuesto base | Permite cargar partidas con código, descripción, unidad, metrado, precio unitario y parcial. | C/P/N/NA | Excel patrón/BD |
| 4 | Validación de presupuesto | Detecta partidas duplicadas, unidades inválidas o importación incompleta. | C/P/N/NA | Reporte de validación |
| 5 | Cronograma valorizado | Registra avance programado por periodo. | C/P/N/NA | Pantalla/reporte |
| 6 | Periodo de valorización | Permite abrir periodo mensual y asociarlo a fechas de trabajo. | C/P/N/NA | Pantalla/log |
| 7 | Registro de metrados | Permite ingresar fórmula, dimensiones, cantidad, partida, frente/sector y sustento. | C/P/N/NA | Caso de prueba |
| 8 | Control de saldos | Advierte o bloquea exceso frente al saldo contractual. | C/P/N/NA | Caso negativo |
| 9 | Evidencias | Permite adjuntar fotografías, ensayos y documentos por partida. | C/P/N/NA | Storage/BD |
| 10 | Revisión supervisor | Permite observar, recortar, aprobar o devolver partidas. | C/P/N/NA | Workflow/log |
| 11 | Levantamiento de observaciones | Permite responder observaciones y reenviar a revisión. | C/P/N/NA | Historial |
| 12 | Cierre técnico | Impide modificar periodo aprobado sin reapertura autorizada. | C/P/N/NA | Caso negativo |
| 13 | Valorización contractual | Calcula anterior, actual, acumulado y saldo por partida. | C/P/N/NA | Reporte comparado |
| 14 | Reajustes | Calcula factor K y reajustes cuando los parámetros estén configurados. | C/P/N/NA | Caso patrón |
| 15 | Amortizaciones | Calcula adelanto directo y de materiales según datos de contrato. | C/P/N/NA | Caso patrón |
| 16 | Resumen financiero | Muestra valorización bruta, deducciones, neto, IGV referencial y monto a facturar. | C/P/N/NA | Reporte |
| 17 | Curva S | Genera datos de avance programado vs ejecutado. | C/P/N/NA | Tabla/gráfico |
| 18 | Claude | Genera borrador de memoria, sustento, conclusiones y recomendaciones. | C/P/N/NA | Prompt/respuesta |
| 19 | Revisión humana de IA | Permite editar, aprobar o rechazar texto generado antes del expediente final. | C/P/N/NA | Historial |
| 20 | Exportación | Compila expediente mensual en Word/PDF con secciones obligatorias. | C/P/N/NA | Archivo exportado |
| 21 | Versionado | Registra versión, hash, fecha, usuario y periodo del documento exportado. | C/P/N/NA | BD/log |
| 22 | Firmas internas | Registra firmas/aprobaciones internas por rol. | C/P/N/NA | Auditoría |
| 23 | Consulta Entidad | Permite acceso de solo lectura al expediente aprobado. | C/P/N/NA | Usuario entidad |
| 24 | Pre-liquidación parcial | Consolida valorizaciones aprobadas y saldos acumulados. | C/P/N/NA | Reporte histórico |
| 25 | Alertas | Muestra alertas de periodos pendientes, fianzas o datos faltantes. | C/P/N/NA | Pantalla/log |

## Anexo 9. Lista de cotejo de seguridad, trazabilidad e IA responsable

Código: LC-SEG-01. Objetivo: validar que el sistema aplique controles mínimos de seguridad, trazabilidad, protección de datos y gobierno de IA antes de su despliegue. Escala: Pasa, Falla, Parcial, NA. Todo ítem crítico fallido debe registrarse en RDF-01.

Tabla A9-1. Lista de cotejo de seguridad, trazabilidad e IA responsable


<!-- Tabla extraida 64 -->
| N.° | Dimensión | Criterio de seguridad/trazabilidad/IA | Escala | Evidencia |
| --- | --- | --- | --- | --- |
| 1 | Autenticación | El sistema exige sesión válida para acceder a módulos protegidos. | Pasa/Falla | Prueba de acceso |
| 2 | Contraseñas/sesión | La sesión expira o se invalida según política definida. | Pasa/Falla | Configuración |
| 3 | Roles | Residente, Supervisor, Entidad, Legal y Administrador tienen permisos diferenciados. | Pasa/Falla | Matriz RBAC |
| 4 | IDOR | Un usuario no puede consultar recursos de otra obra sin autorización. | Pasa/Falla | Caso negativo |
| 5 | RLS/políticas DB | Las reglas de base de datos limitan lectura/escritura por rol y proyecto. | Pasa/Falla | Script/políticas |
| 6 | Secretos | El frontend no contiene claves privadas ni tokens de servicios backend. | Pasa/Falla | Repositorio/build |
| 7 | CORS | Solo dominios autorizados pueden invocar la API. | Pasa/Falla | Configuración API |
| 8 | Rate limiting | Cloudflare/API limita abuso de endpoints sensibles. | Pasa/Parcial/Falla | Reglas Cloudflare |
| 9 | Archivos | Los documentos y evidencias no son públicos por defecto. | Pasa/Falla | Storage/políticas |
| 10 | Validación de entradas | La API valida tipos, rangos y campos obligatorios. | Pasa/Falla | Pruebas API |
| 11 | Auditoría | Acciones críticas generan log con usuario, fecha, IP o contexto, módulo y resultado. | Pasa/Parcial/Falla | Logs |
| 12 | No repudio interno | Firmas internas registran usuario autenticado, fecha, hash y documento asociado. | Pasa/Parcial/Falla | BD/documento |
| 13 | Integridad documental | El expediente exportado registra hash o identificador de versión. | Pasa/Falla | Archivo/BD |
| 14 | Escaneo de secretos | Gitleaks o equivalente no reporta secretos expuestos. | Pasa/Falla | Reporte CI |
| 15 | Análisis estático | CodeQL/Sonar no reporta vulnerabilidades críticas o altas abiertas. | Pasa/Falla | Quality gate |
| 16 | Prueba OWASP | ZAP u otra herramienta no detecta riesgos críticos no tratados. | Pasa/Falla | Reporte ZAP |
| 17 | Datos personales | Se minimizan datos personales y geográficos enviados a reportes o IA. | Pasa/Parcial/Falla | Revisión de payload |
| 18 | Claude - datos enviados | El prompt no incluye datos sensibles innecesarios ni archivos no autorizados. | Pasa/Falla | Prompt/log |
| 19 | Claude - control humano | Ninguna salida de IA se incorpora al informe sin revisión del usuario responsable. | Pasa/Falla | Historial IA |
| 20 | Claude - trazabilidad | Prompt, respuesta, versión y decisión humana quedan registrados. | Pasa/Parcial/Falla | Logs IA |
| 21 | Claude - alucinación | La ficha FVI-01 verifica que no haya afirmaciones sin sustento en datos aprobados. | Pasa/Falla | Ficha IA |
| 22 | Backups | Existe procedimiento de respaldo y recuperación para BD y archivos críticos. | Pasa/Parcial/Falla | Plan backup |
| 23 | Monitoreo | Se monitorean errores, disponibilidad y endpoints críticos. | Pasa/Parcial/Falla | Dashboard/logs |
| 24 | Despliegue seguro | Variables de entorno se gestionan fuera del repositorio. | Pasa/Falla | Railway/GitHub |
| 25 | Retención | Se define retención de logs, documentos y evidencias según necesidad del proyecto. | Pasa/Parcial/Falla | Política interna |

## Anexo 10. Ficha de ejecución de casos de prueba

Código: FCP-01. Objetivo: registrar de forma uniforme la ejecución de casos de prueba manuales o semiautomatizados. Cada caso debe estar vinculado a un requerimiento, datos de prueba, pasos, resultado esperado, resultado obtenido, evidencia y defectos asociados.

Tabla A10-1. Datos generales del caso de prueba


<!-- Tabla extraida 65 -->
| Campo | Dato | Campo | Dato |
| --- | --- | --- | --- |
| ID caso | CP-____ | Módulo | ________________ |
| Requerimiento vinculado | RF/RNF-____ | Prioridad | Alta / Media / Baja |
| Ejecutor | ________________ | Fecha | ____/____/________ |
| Ambiente | Local / QA / Staging / Producción controlada | Versión build | ________________ |

Tabla A10-2. Estructura de la ficha de caso de prueba


<!-- Tabla extraida 66 -->
| Sección | Contenido requerido |
| --- | --- |
| Precondiciones | Usuarios, permisos, proyecto, periodo, presupuesto y datos necesarios antes de iniciar. |
| Datos de prueba | Archivo, partida, metrado, avance, índice, adelanto, foto, ensayo o prompt usado. |
| Pasos de ejecución | Enumerar acciones exactas realizadas por el usuario o script. |
| Resultado esperado | Definir respuesta correcta del sistema, cálculo esperado, estado o mensaje. |
| Resultado obtenido | Registrar lo que ocurrió realmente, incluyendo errores o diferencias. |
| Estado | Aprobado / Fallido / Bloqueado / No ejecutado. |
| Evidencia | Captura, reporte HTML, log, documento generado, hash, video o registro de BD. |
| Defecto asociado | ID del registro RDF-01 si corresponde. |
| Retest | Fecha, responsable y resultado de repetición después de corrección. |

Tabla A10-3. Ejemplo de caso crítico de metrado


<!-- Tabla extraida 67 -->
| Elemento | Ejemplo |
| --- | --- |
| Objetivo | Validar que el sistema no permita valorizar una partida por encima del saldo contractual. |
| Datos | Partida 03.01, metrado contractual 100 m2, acumulado anterior 95 m2, metrado actual propuesto 10 m2. |
| Resultado esperado | El sistema debe advertir o bloquear el registro porque el acumulado sería 105 m2, excediendo el saldo contractual. |
| Criterio de aprobación | Caso aprobado solo si el exceso no puede cerrarse sin corrección o autorización registrada. |

## Anexo 11. Registro de defectos y no conformidades

Código: RDF-01. Objetivo: controlar hallazgos detectados durante pruebas, validaciones documentales, seguridad, rendimiento o revisión de IA. El registro debe permitir priorizar correcciones, ejecutar retest y cerrar defectos con evidencia.

Tabla A11-1. Estructura del registro de defectos


<!-- Tabla extraida 68 -->
| Campo | Descripción |
| --- | --- |
| ID | Código único: DEF-001, DEF-002. |
| Fecha de detección | Fecha y hora del hallazgo. |
| Reportado por | QA, usuario experto, desarrollador, supervisor o herramienta automática. |
| Módulo | Proyecto, presupuesto, metrados, workflow, valorización, IA, exportación, seguridad, despliegue. |
| Tipo | Bug funcional, cálculo, seguridad, rendimiento, usabilidad, documentación, IA, dato, integración. |
| Severidad | Crítica, Alta, Media, Baja. Crítica bloquea aceptación del sistema o compromete seguridad/cálculo. |
| Prioridad | P1 inmediata, P2 alta, P3 normal, P4 mejora futura. |
| Descripción | Qué ocurrió y por qué representa un defecto o no conformidad. |
| Pasos para reproducir | Secuencia exacta que permite repetir el problema. |
| Resultado esperado | Comportamiento correcto. |
| Resultado obtenido | Comportamiento observado. |
| Evidencia | Captura, log, reporte, documento, video, hash o caso de prueba vinculado. |
| Responsable | Persona encargada de corregir o analizar. |
| Estado | Nuevo, Asignado, En progreso, Corregido, Retest, Cerrado, Reabierto, Diferido. |
| Fecha de cierre | Fecha de cierre validada. |
| Retest | Resultado del retest y evidencia. |

Tabla A11-2. Criterios de severidad


<!-- Tabla extraida 69 -->
| Severidad | Criterio | Decisión |
| --- | --- | --- |
| Crítica | Cálculo económico incorrecto, fuga de datos, acceso no autorizado, pérdida de evidencias, imposibilidad de exportar expediente final. | Bloquea liberación. |
| Alta | Workflow incorrecto, error en roles, documento incompleto, Claude incorpora contenido no sustentado, vulnerabilidad alta. | Corregir antes de UAT final. |
| Media | Validación insuficiente, mensaje confuso, reporte con formato menor, lentitud puntual. | Corregir según sprint. |
| Baja | Detalle visual, texto menor, mejora de ayuda o formato. | Puede planificarse. |

## Anexo 12. Ficha de validación del expediente mensual generado

Código: FVE-01. Objetivo: validar que el informe mensual de valorización generado por el sistema cumpla la estructura técnica y documental esperada para una obra pública. Se basa en los modelos de informes de obra revisados, los cuales incorporan aspectos generales, estado físico-financiero, metrados, valorización, Curva S, control de plazos, panel fotográfico, ensayos, conclusiones y recomendaciones.

Tabla A12-1. Lista de validación del expediente mensual


<!-- Tabla extraida 70 -->
| N.° | Criterio documental | Escala | Evidencia |
| --- | --- | --- | --- |
| 1 | Portada con nombre de obra, entidad, contratista, residente/supervisor y periodo. | C/P/N | Documento |
| 2 | Índice o estructura numerada del expediente. | C/P/N | Documento |
| 3 | Ficha técnica con contrato, monto, plazo, fechas, modalidad y responsables. | C/P/N | Documento/BD |
| 4 | Resumen ejecutivo contractual y situacional. | C/P/N | Documento |
| 5 | Estado físico programado, ejecutado del mes y acumulado. | C/P/N | Reporte |
| 6 | Estado financiero programado, ejecutado, acumulado y saldo. | C/P/N | Reporte |
| 7 | Planilla de metrados por partida con anterior, actual, acumulado y saldo. | C/P/N | Planilla |
| 8 | Valorización contractual con montos correctos por partida. | C/P/N | Reporte |
| 9 | Reajustes, amortizaciones, deducciones e IGV referencial cuando corresponda. | C/P/N/NA | Reporte |
| 10 | Curva S o cuadro programado vs ejecutado. | C/P/N | Reporte/gráfico |
| 11 | Control de plazos, ampliaciones, suspensiones o atrasos. | C/P/N/NA | Documento |
| 12 | Control de adicionales, deductivos o modificaciones contractuales. | C/P/N/NA | Documento |
| 13 | Registro de principales ocurrencias del periodo. | C/P/N | Documento/log |
| 14 | Ensayos de laboratorio y control de calidad con comentario técnico. | C/P/N/NA | Ensayos |
| 15 | Panel fotográfico por partida, fecha, descripción y ubicación cuando exista. | C/P/N | Fotos |
| 16 | Sustento técnico de trabajos ejecutados. | C/P/N | Memoria |
| 17 | Conclusiones coherentes con avance, estado de obra y observaciones. | C/P/N | Documento |
| 18 | Recomendaciones técnicas y administrativas pertinentes. | C/P/N | Documento |
| 19 | Firmas internas o aprobaciones del residente, supervisor y representante legal según flujo. | C/P/N | Documento/auditoría |
| 20 | Versión, hash, fecha de generación y usuario responsable. | C/P/N | BD/log |
| 21 | No existen contradicciones entre resumen, planilla, valorización y acumulados. | C/P/N | Revisión cruzada |
| 22 | No existen textos generados por IA sin revisión/aprobación humana. | C/P/N | Historial IA |

Criterio de aceptación: el expediente mensual se considera aprobado si todos los ítems críticos obtienen C = cumple. Los ítems parciales deben tener observación, responsable y fecha de corrección. Si el informe presenta inconsistencias entre planilla, valorización y resumen financiero, no debe aprobarse.

## Anexo 13. Ficha de validación de salidas generadas con Claude

Código: FVI-01. Objetivo: evaluar que los textos generados por Claude sean útiles, técnicos, trazables y seguros, sin sustituir la responsabilidad del Residente o Supervisor. La salida de IA debe considerarse borrador asistido y no documento aprobado automáticamente.

Tabla A13-1. Datos de la generación con IA


<!-- Tabla extraida 71 -->
| Campo | Dato | Campo | Dato |
| --- | --- | --- | --- |
| ID generación | IA-____ | Módulo | Memoria / Sustento / Conclusiones / Recomendaciones |
| Usuario solicitante | ________________ | Fecha | ____/____/________ |
| Datos usados | Metrados aprobados / observaciones / avances / evidencias / ensayos | Prompt versión | v____ |
| Decisión final | Aprobado / Editado / Rechazado | Revisor | ________________ |

Tabla A13-2. Evaluación de calidad y seguridad de la salida de Claude


<!-- Tabla extraida 72 -->
| N.° | Criterio de evaluación IA | Escala | Evidencia |
| --- | --- | --- | --- |
| 1 | El texto se basa en datos aprobados del periodo. | 1-5 | Comparar con BD/reporte |
| 2 | No incluye partidas, montos, porcentajes o hechos inexistentes. | 1-5 | Revisión técnica |
| 3 | Mantiene lenguaje formal y propio de informes de obra pública. | 1-5 | Revisión documental |
| 4 | Describe trabajos ejecutados con precisión y sin exageraciones. | 1-5 | Metrados/evidencias |
| 5 | Las conclusiones se relacionan con avance físico-financiero real. | 1-5 | Resumen valorización |
| 6 | Las recomendaciones son pertinentes y ejecutables. | 1-5 | Criterio experto |
| 7 | No expone datos personales innecesarios o información sensible. | Pasa/Falla | Prompt/salida |
| 8 | No presenta instrucciones inseguras ni contenido ajeno al proyecto. | Pasa/Falla | Salida IA |
| 9 | El usuario puede editar el texto antes de exportar. | Pasa/Falla | UI/historial |
| 10 | La versión final registra decisión humana: aprobado, editado o rechazado. | Pasa/Falla | Auditoría |
| 11 | Se conserva trazabilidad de prompt, respuesta y datos utilizados. | Pasa/Parcial/Falla | Logs IA |
| 12 | El texto no contradice el reporte económico ni el estado de obra. | Pasa/Falla | Revisión cruzada |
| 13 | El texto evita emitir afirmaciones legales definitivas no sustentadas. | Pasa/Falla | Revisión experto |
| 14 | La salida puede reproducirse o auditarse con identificador de generación. | Pasa/Parcial/Falla | ID generación |

Interpretación: una salida de IA se aprueba si todos los criterios de seguridad y trazabilidad obtienen Pasa y si los criterios Likert alcanzan promedio mínimo de 4.0. Si existe contenido no sustentado, contradicción con datos aprobados o exposición innecesaria de datos, la salida debe rechazarse o editarse antes de incorporarse al expediente.

## Anexo 14. Encuesta de satisfacción y usabilidad para usuarios

Código: EU-01. Objetivo: medir la percepción de usuarios técnicos sobre facilidad de uso, claridad, utilidad, confianza y reducción de esfuerzo operativo. Escala Likert: 1 = totalmente en desacuerdo, 2 = en desacuerdo, 3 = neutral, 4 = de acuerdo, 5 = totalmente de acuerdo.

Tabla A14-1. Encuesta de usabilidad y satisfacción


<!-- Tabla extraida 73 -->
| N.° | Ítem de encuesta | Escala |
| --- | --- | --- |
| 1 | La interfaz del sistema es clara y fácil de entender. | 1-5 |
| 2 | El registro de datos de obra y contrato resulta ordenado. | 1-5 |
| 3 | La carga o registro del presupuesto base facilita el trabajo del usuario. | 1-5 |
| 4 | El registro de metrados es más controlado que el proceso manual. | 1-5 |
| 5 | Las validaciones del sistema ayudan a evitar errores. | 1-5 |
| 6 | La asociación de evidencias por partida mejora el sustento del avance. | 1-5 |
| 7 | El flujo de revisión y observaciones es comprensible. | 1-5 |
| 8 | El cálculo de valorización genera confianza. | 1-5 |
| 9 | La generación del expediente reduce trabajo repetitivo. | 1-5 |
| 10 | Los textos generados con Claude son útiles como borrador técnico. | 1-5 |
| 11 | El sistema permite revisar y corregir información antes de aprobar. | 1-5 |
| 12 | El sistema mejora la trazabilidad del informe mensual. | 1-5 |
| 13 | El sistema ayuda a reducir tiempos de elaboración. | 1-5 |
| 14 | El sistema facilita la revisión por parte del supervisor o inspector. | 1-5 |
| 15 | Recomendaría usar el sistema en obras similares. | 1-5 |

Tabla A14-2. Preguntas abiertas complementarias


<!-- Tabla extraida 74 -->
| Código | Pregunta abierta |
| --- | --- |
| Pregunta abierta 1 | ¿Qué parte del sistema le resultó más útil para elaborar o revisar la valorización mensual? |
| Pregunta abierta 2 | ¿Qué dificultad encontró durante el uso del sistema? |
| Pregunta abierta 3 | ¿Qué funcionalidad debería mejorarse antes de usarlo en una obra real? |
| Pregunta abierta 4 | ¿Qué información adicional debería mostrar el expediente mensual generado? |

Criterio de interpretación: se recomienda calcular promedio por dimensión y promedio general. Si una dimensión obtiene promedio menor a 4.0, debe analizarse como oportunidad de mejora. Las respuestas abiertas deben codificarse por temas: interfaz, cálculos, documentos, IA, seguridad, rendimiento o capacitación.

## Anexo 15. Matriz de trazabilidad entre requerimientos, instrumentos, pruebas y evidencias

Código: MT-01. Objetivo: asegurar que cada requerimiento relevante tenga al menos un caso de prueba, un instrumento de validación y una evidencia de aceptación. Esta matriz debe mantenerse actualizada durante el desarrollo y cerrarse en el reporte final de pruebas.

Tabla A15-1. Matriz de trazabilidad de validación


<!-- Tabla extraida 75 -->
| Requerimiento | Área cubierta | Instrumento | Prueba asociada | Evidencia mínima | Responsable |
| --- | --- | --- | --- | --- | --- |
| RF-01 a RF-05 | Gestión de usuarios, roles y proyectos | LC-FUNC-01, LC-SEG-01 | Manual, integración, seguridad | Capturas, BD, matriz RBAC | QA/Administrador |
| RF-06 a RF-11 | Presupuesto, partidas, cronograma e índices | LC-FUNC-01, FCP-01 | Unitarias, integración | Excel patrón, reporte importación | QA/Residente |
| RF-12 a RF-16 | Metrados y evidencias | LC-FUNC-01, FCP-01 | Manual, E2E, integración | Caso de prueba, storage, BD | QA/Residente |
| RF-17 a RF-21 | Revisión, observación, recorte y aprobación | LC-FUNC-01, MT-01 | E2E, roles, regresión | Historial workflow, logs | QA/Supervisor |
| RF-22 a RF-27 | Valorización, reajustes, amortizaciones y avances | FCP-01, RDF-01 | Unitarias, integración, comparación patrón | Reporte económico, cálculo patrón | QA/Líder técnico |
| RF-28 a RF-33 | Panel, Claude, expediente, versión y hash | LC-DOC-01, FVE-01, FVI-01 | Documental, IA, regresión exportación | Word/PDF, prompt, hash, log IA | QA/Residente |
| RF-34 a RF-38 | Firmas, consulta de entidad y pre-liquidación | LC-FUNC-01, LC-SEG-01 | Manual, seguridad, E2E | Auditoría, usuario entidad, reporte | QA/Entidad |
| RNF-01 a RNF-03 | Usabilidad, rendimiento y confiabilidad | EU-01, FCP-01 | UAT, carga, unitarias | Encuesta, k6/JMeter, coverage | QA/Usuarios |
| RNF-04 a RNF-05 | Seguridad y privacidad | LC-SEG-01 | Seguridad, roles, escaneo | ZAP, CodeQL, Gitleaks, logs | DevSecOps |
| RNF-06 a RNF-10 | Mantenibilidad, portabilidad, auditoría y calidad de código | MT-01, LC-SEG-01 | CI/CD, análisis estático, revisión | Quality gate, pipeline, commits | Líder técnico |
| RNF-11 a RNF-15 | Pruebas, IA responsable, disponibilidad, observabilidad e interoperabilidad futura | FVI-01, MT-01, LC-SEG-01 | IA, smoke, monitoreo, documentación | Reporte IA, health checks, logs | QA/Líder técnico |

Regla de cierre: un requerimiento se considera cubierto si tiene caso de prueba ejecutado, resultado aprobado, evidencia almacenada y ausencia de defectos críticos o altos abiertos. Si el requerimiento depende de IA, debe contar además con ficha FVI-01 y registro de revisión humana.


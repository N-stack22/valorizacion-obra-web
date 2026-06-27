-- Permitir operaciones sobre el bucket 'expedientes' cuando el path inicia
-- con un project_id donde el usuario tiene acceso al proyecto.
-- Convención de path: {projectId}/{periodId}/{filename}.pdf

DROP POLICY IF EXISTS "expedientes_insert_project_editors" ON storage.objects;
CREATE POLICY "expedientes_insert_project_editors"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'expedientes'
    AND public.can_edit_project_data(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  );

DROP POLICY IF EXISTS "expedientes_select_project_members" ON storage.objects;
CREATE POLICY "expedientes_select_project_members"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'expedientes'
    AND public.can_view_project(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  );

DROP POLICY IF EXISTS "expedientes_update_project_editors" ON storage.objects;
CREATE POLICY "expedientes_update_project_editors"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'expedientes'
    AND public.can_edit_project_data(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'expedientes'
    AND public.can_edit_project_data(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  );

DROP POLICY IF EXISTS "expedientes_delete_project_editors" ON storage.objects;
CREATE POLICY "expedientes_delete_project_editors"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'expedientes'
    AND public.can_edit_project_data(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  );

def migrate(cr, version):
    # Add infinite_scroll column if it doesn't exist
    cr.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='website' AND column_name='infinite_scroll') THEN
                ALTER TABLE website ADD COLUMN infinite_scroll boolean DEFAULT true;
            END IF;
        END $$;
    """
    )

    # Add infinite_scroll_threshold column if it doesn't exist
    cr.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='website' AND column_name='infinite_scroll_threshold') THEN
                ALTER TABLE website ADD COLUMN infinite_scroll_threshold integer DEFAULT 500;
            END IF;
        END $$;
    """
    )

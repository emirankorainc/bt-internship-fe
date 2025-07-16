import { useBucketView } from '@app/features/buckets/hooks';
import { BucketHeader } from './BucketHeader';
import { BucketCreation } from './BucketCreation';
import { LevelSidebar } from './LevelSidebar';
import { LevelForm } from './LevelForm';
import { LevelDetails } from './LevelDetails';
import { UpdateBucketDialog } from './dialog/UpdateBucketDialog';
import { useState } from 'react';

/**
 * BucketViewContainer is the main container component that manages
 * the bucket view functionality. It delegates rendering to appropriate
 * sub-components based on the current state.
 */
export const BucketViewContainer = () => {
  const {
    // Data
    bucket,
    hasLevels,
    currentLevel,
    maxLevel,

    // State
    selectedLevel,
    isEditingLevel,
    isCreatingLevel,
    bucketTitle,
    editingLevel,

    // Actions
    navigateBack,
    handleLevelSelect,
    handleEditLevel,
    handleCreateLevel,
    handleCancelEdit,
    updateBucketTitle,
    addListItem,
    updateListItem,
    removeListItem,
    handleSaveBucket,
  } = useBucketView();

  const [isUpdateBucketOpen, setIsUpdateBucketOpen] = useState(false);

  const handleOpenUpdateBucket = () => {
    setIsUpdateBucketOpen(true);
  };

  const handleCloseUpdateBucket = () => {
    setIsUpdateBucketOpen(false);
  };

  // Loading or error states could be handled here
  if (!bucket) {
    return (
      <div className="h-full w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
          <BucketHeader onNavigateBack={navigateBack} title="Bucket Not Found" />
          <div className="mt-6 sm:mt-8">
            <div className="text-center">
              <h2 className="text-foreground mb-2 text-xl font-bold sm:text-2xl">Bucket Not Found</h2>
              <p className="text-muted-foreground">The requested bucket could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render bucket creation view when no levels exist
  if (!hasLevels) {
    return (
      <div className="h-full w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
          <BucketHeader
            title={bucket.name}
            description={bucket.description}
            totalLevels={bucket.bucketLevels.length}
            onNavigateBack={navigateBack}
          />
          <div className="mt-6 sm:mt-8">
            <BucketCreation
              bucketTitle={bucketTitle}
              onUpdateTitle={updateBucketTitle}
              onCreateLevel={handleCreateLevel}
              onSaveBucket={handleSaveBucket}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render editing/creating form view
  if (isEditingLevel || isCreatingLevel) {
    return (
      <div className="h-full w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
          <BucketHeader
            title={bucket.name}
            description={bucket.description}
            totalLevels={bucket.bucketLevels.length}
            onNavigateBack={navigateBack}
            breadcrumb="Buckets"
          />
          <div className="mt-6 sm:mt-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-4">
              <LevelSidebar
                name={bucket.name}
                currentLevel={currentLevel}
                levels={bucket.bucketLevels}
                selectedLevel={selectedLevel}
                maxLevel={maxLevel}
                onLevelSelect={handleLevelSelect}
                onCreateLevel={handleCreateLevel}
                showCreateButton={!isCreatingLevel}
              />
              <LevelForm
                bucketId={bucket.id}
                levelId={selectedLevel?.id}
                editingLevel={editingLevel}
                isCreating={isCreatingLevel}
                onCancel={handleCancelEdit}
                onAddListItem={addListItem}
                onUpdateListItem={updateListItem}
                onRemoveListItem={removeListItem}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main bucket view with levels
  return (
    <div className="h-full w-full p-4 sm:p-6 lg:p-8">
      <div className="mx-auto h-full w-full max-w-7xl pb-6 sm:pb-8">
        <BucketHeader
          title={bucket.name}
          description={bucket.description}
          totalLevels={bucket.bucketLevels.length}
          onNavigateBack={navigateBack}
          onOpenUpdateBucket={handleOpenUpdateBucket}
        />
        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-4">
            <LevelSidebar
              name={bucket.name}
              levels={bucket.bucketLevels}
              currentLevel={currentLevel}
              selectedLevel={selectedLevel}
              maxLevel={maxLevel}
              onLevelSelect={handleLevelSelect}
              onCreateLevel={handleCreateLevel}
            />
            {selectedLevel && (
              <LevelDetails
                name={bucket.name}
                currentLevel={currentLevel}
                level={selectedLevel}
                maxLevel={maxLevel}
                onEditLevel={handleEditLevel}
              />
            )}
          </div>
        </div>

        <UpdateBucketDialog
          bucket={bucket}
          isOpen={isUpdateBucketOpen}
          onClose={handleCloseUpdateBucket}
        />
      </div>
    </div>
  );
};
